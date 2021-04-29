import { locationSelector } from '../../shared/utils/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { removeFormApi } from 'platform/forms/save-in-progress/api';

import {
  getQuestionTextById,
  QUESTION_IDS,
} from '../constants/questionnaire.questions';

// pull from src/platform/forms-system/src/js/actions.js
// so we can have our own custom error handling,  messages and headers
const submitToUrl = (body, submitUrl, trackingPrefix, eventData) => {
  // This item should have been set in any previous API calls
  const csrfTokenStored = localStorage.getItem('csrfToken');
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('POST', submitUrl);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        recordEvent({
          event: `${trackingPrefix}-submission-successful`,
          ...eventData,
        });
        // got this from the fetch polyfill, keeping it to be safe
        const responseBody =
          'response' in req ? req.response : req.responseText;
        const results = JSON.parse(responseBody);
        resolve(results);
      } else {
        let error;
        if (req.status === 429) {
          error = new Error(`vets_throttled_error: ${req.statusText}`);
          error.extra = parseInt(
            req.getResponseHeader('x-ratelimit-reset'),
            10,
          );
        } else {
          error = new Error(`vets_server_error: ${req.statusText}`);
        }
        error.statusText = req.statusText;
        reject(error);
      }
    });

    req.addEventListener('error', () => {
      const error = new Error('vets_client_error: Network request failed');
      error.statusText = req.statusText;
      recordEvent({
        event: `${trackingPrefix}-submission-failed`,
        ...eventData,
        'error-key': error.statusText,
      });
      reject(error);
    });

    req.addEventListener('abort', () => {
      const error = new Error('vets_client_error: Request aborted');
      error.statusText = req.statusText;
      recordEvent({
        event: `${trackingPrefix}-submission-failed`,
        ...eventData,
        'error-key': error.statusText,
      });
      reject(error);
    });

    req.addEventListener('timeout', () => {
      const error = new Error('vets_client_error: Request timed out');
      error.statusText = req.statusText;
      recordEvent({
        event: `${trackingPrefix}-submission-failed`,
        ...eventData,
        'error-key': error.statusText,
      });
      reject(error);
    });

    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('X-CSRF-Token', csrfTokenStored);
    req.withCredentials = true;

    req.send(body);
  });
};

const submit = async (useMockData, form, formConfig) => {
  const body = {
    questionnaireResponse: formConfig.transformForSubmit(formConfig, form),
  };
  if (useMockData) {
    return Promise.all([
      await removeFormApi(form.formId),
      new Promise((resolve, _reject) => {
        resolve(body);
        // reject(body);
      }),
    ]);
  } else {
    const eventData = {};

    return Promise.all([
      await submitToUrl(
        JSON.stringify(body),
        formConfig.submitUrl,
        formConfig.trackingPrefix,
        eventData,
      ),
      await removeFormApi(form.formId),
    ]);
  }
};

const createAnAnswer = valueString => ({ valueString });

const createAnswerArray = value => (value ? [createAnAnswer(value)] : []);

const transformForSubmit = (_formConfig, form) => {
  // console.log({ formConfig, form });
  // const { questionnaireId, appointmentId } = form.data['hidden:fields'] || {};
  const questionnaire = form.data['hidden:questionnaire']
    ? form.data['hidden:questionnaire'][0]
    : {};
  const appointment = form.data['hidden:appointment'];
  const clinic = form.data['hidden:clinic'];
  const type = locationSelector.getType(clinic, { titleCase: true });
  const title = `${type} questionnaire`;
  const {
    reasonForVisit,
    reasonForVisitDescription,
    lifeEvents,
    questions,
  } = form.data;
  const additionalQuestions = questions || [];
  return {
    appointment,
    questionnaire: { ...questionnaire, title },
    item: [
      {
        linkId: QUESTION_IDS.REASON_FOR_VISIT,
        text: getQuestionTextById(QUESTION_IDS.REASON_FOR_VISIT),
        answer: createAnswerArray(reasonForVisit),
      },
      {
        linkId: QUESTION_IDS.REASON_FOR_VISIT_DESCRIPTION,
        text: getQuestionTextById(QUESTION_IDS.REASON_FOR_VISIT_DESCRIPTION),
        answer: createAnswerArray(reasonForVisitDescription),
      },
      {
        linkId: QUESTION_IDS.LIFE_EVENTS,
        text: getQuestionTextById(QUESTION_IDS.LIFE_EVENTS),
        answer: createAnswerArray(lifeEvents),
      },
      {
        linkId: QUESTION_IDS.ADDITIONAL_QUESTIONS,
        text: getQuestionTextById(QUESTION_IDS.ADDITIONAL_QUESTIONS),
        answer: [
          ...additionalQuestions
            .filter(answer => answer.additionalQuestions)
            .map(answer => createAnAnswer(answer.additionalQuestions)),
        ],
      },
    ],
  };
};

export { submit, transformForSubmit, createAnswerArray, createAnAnswer };
