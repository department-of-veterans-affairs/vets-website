import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const formSignatureSchema = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRole: {
      ...radioUI({
        title: 'Which of these best describes you?',
        required: () => true,
        labels: {
          applicant: 'I’m filling out this form for myself',
          other:
            'I’m a parent, spouse, or legal representative signing on behalf of the beneficiary',
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
