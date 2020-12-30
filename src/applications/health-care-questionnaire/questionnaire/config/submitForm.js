import { submitToUrl } from 'platform/forms-system/src/js/actions';

const submit = (form, formConfig) => {
  const body = JSON.stringify(formConfig.transformForSubmit(formConfig, form));

  const eventData = {};
  // console.log('submitting', { body, url: formConfig.submitUrl });
  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    eventData,
  );
};

const createAnAnswer = valueString => ({ valueString });

const transformForSubmit = (_formConfig, form) => {
  // console.log({ formConfig, form });
  const { questionnaireId, appointmentId } = form.data['hidden:fields'];
  const { reasonForVisitDescription, lifeEvents, questions } = form.data;
  return {
    appointmentId,
    questionnaireId,
    item: [
      {
        linkId: '01',
        text: 'What is the reason for this appointment?',
        answer: [createAnAnswer('Some reason to visit')],
      },
      {
        linkId: '02',
        text:
          "Are there any additional details you'd like to share with your provider about this appointment?",
        answer: [createAnAnswer(reasonForVisitDescription)],
      },
      {
        linkId: '03',
        text:
          'Are there any life events that are positively or negatively affecting your health (e.g. marriage, divorce, new job, retirement, parenthood, or finances)?',
        answer: [createAnAnswer(lifeEvents)],
      },
      {
        linkId: '04',
        text:
          'Do you have other questions you want to ask your provider? Please enter them below with your most important question listed first.',
        answer: [
          ...questions
            .filter(answer => answer.additionalQuestions)
            .map(answer => createAnAnswer(answer.additionalQuestions)),
        ],
      },
    ],
  };
};

export { submit, transformForSubmit };
