import {
  emailUI,
  emailSchema,
  titleUI,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
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

export const applicationEmailSchema = {
  uiSchema: {
    ...titleUI(
      'Your email address',
      `We'll use this email address to send you information about the form.`,
    ),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierEmail'],
    properties: {
      certifierEmail: emailSchema,
    },
  },
};

export const champvaScreenSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData.certifierRole === 'applicant' ? 'Your' : `Beneficiary's`
        } CHAMPVA benefit status`,
    ),
    champvaBenefitStatus: {
      ...yesNoUI({
        required: () => true,
        labels: {
          yes: 'Yes',
          no: 'No',
        },
        updateUiSchema: formData => {
          return {
            'ui:title': `${
              formData?.certifierRole === 'applicant'
                ? 'Do you'
                : 'Does your beneficiary'
            } 
                receive CHAMPVA benefits now?`,
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['champvaBenefitStatus'],
    properties: {
      champvaBenefitStatus: yesNoSchema,
    },
  },
};
