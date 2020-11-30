export const uiSchema = {
  spouseInformation: {
    'ui:title': 'Your spouse information',
    maritalStatus: {
      'ui:title': 'What is your marital status?',
      'ui:widget': 'radio',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        maritalStatus: {
          type: 'string',
          enum: [
            'Single',
            'Married',
            'Widowed',
            'Divorced',
            'Separated',
            'Registered partnership',
          ],
        },
      },
    },
  },
};
