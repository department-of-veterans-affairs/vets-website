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

const transformForSubmit = (_formConfig, _form) => {
  // console.log({ formConfig, form });
  return {
    appointmentId: 'ABC-123-from-state',
    questionnaireId: 'XYZ-123-from-state',
    item: [
      {
        linkId: '01',
        text: 'What is the reason for this appointment?',
        answer: [
          {
            valueString: 'Eye is hurting',
          },
        ],
      },
      {
        linkId: '02',
        text:
          "Are there any additional details you'd like to share with your provider about this appointment?",
        answer: [
          {
            valueString: 'cant look into the sun',
          },
        ],
      },
      {
        linkId: '03',
        text:
          'Are there any life events that are positively or negatively affecting your health (e.g. marriage, divorce, new job, retirement, parenthood, or finances)?',
        answer: [
          {
            valueString: 'no',
          },
        ],
      },
      {
        linkId: '04',
        text:
          'Do you have other questions you want to ask your provider? Please enter them below with your most important question listed first.',
        answer: [
          {
            valueString: 'Is this covered by my VA Benfits?',
          },
        ],
      },
    ],
  };
};

export { submit, transformForSubmit };
