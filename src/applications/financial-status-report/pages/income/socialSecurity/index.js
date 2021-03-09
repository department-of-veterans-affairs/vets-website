export const uiSchema = {
  'ui:title': 'Your other income',
  questions: {
    hasSocialSecurity: {
      'ui:title': 'Do you get Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasSocialSecurity: {
          type: 'boolean',
        },
      },
    },
  },
};
