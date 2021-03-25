import { locationSelector } from '../../shared/utils/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { removeFormApi } from 'platform/forms/save-in-progress/api';

const USE_MOCK_DATA = true;

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
      reject(error);
    });

    req.addEventListener('abort', () => {
      const error = new Error('vets_client_error: Request aborted');
      error.statusText = req.statusText;
      reject(error);
    });

    req.addEventListener('timeout', () => {
      const error = new Error('vets_client_error: Request timed out');
      error.statusText = req.statusText;
      reject(error);
    });

    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('X-CSRF-Token', csrfTokenStored);
    req.withCredentials = true;

    req.send(body);
  });
};

const submit = async (form, formConfig) => {
  const body = {
    questionnaireResponse: formConfig.transformForSubmit(formConfig, form),
  };
  if (USE_MOCK_DATA) {
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
        linkId: '01',
        text: 'What is the reason for this appointment?',
        answer: createAnswerArray(reasonForVisit),
      },
      {
        linkId: '02',
        text:
          "Are there any additional details you'd like to share with your provider about this appointment?",
        answer: createAnswerArray(reasonForVisitDescription),
      },
      {
        linkId: '03',
        text:
          'Are there any life events that are positively or negatively affecting your health (e.g. marriage, divorce, new job, retirement, parenthood, or finances)?',
        answer: createAnswerArray(lifeEvents),
      },
      {
        linkId: '04',
        text:
          'Do you have other questions you want to ask your provider? Please enter them below with your most important question listed first.',
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
