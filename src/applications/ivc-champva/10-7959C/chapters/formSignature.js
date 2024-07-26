import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const formSignatureSchema = {
  uiSchema: {
    ...titleUI('Form signature'),
    certifierRole: {
      ...radioUI({
        updateUiSchema: formData => {
          const labels = {
            applicant: `I'm ${
              formData?.applicantName?.first
            } and I'm signing for myself`,
            other: `I'm a parent, spouse, or legal representative signing on behalf of ${
              formData?.applicantName?.first
            }`,
          };

          return {
            'ui:title': `Who’s signing this form for ${
              formData?.applicantName?.first
            }?`,
            'ui:options': {
              labels,
            },
          };
        },
        required: () => true,
        labels: {
          applicant: 'The beneficiary',
          other: 'A representative on behalf of the beneficiary',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['certifierRole'],
    properties: {
      certifierRole: radioSchema(['applicant', 'other']),
    },
  },
};
