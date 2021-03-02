import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { getAppointTypeFromAppointment } from '../utils';
// import environment from 'platform/utilities/environment';

const USE_MOCK_DATA = window.Cypress; // || environment.isLocalhost || environment.isStaging;

const submit = (form, formConfig) => {
  const body = {
    questionnaireResponse: formConfig.transformForSubmit(formConfig, form),
  };
  if (USE_MOCK_DATA) {
    return new Promise((resolve, _reject) => {
      resolve(body);
      // reject(body);
    });
  } else {
    // Commented out till API is working.
    const eventData = {};

    return submitToUrl(
      JSON.stringify(body),
      formConfig.submitUrl,
      formConfig.trackingPrefix,
      eventData,
    );
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
  const type = getAppointTypeFromAppointment(appointment, { titleCase: true });
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
