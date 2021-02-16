export const uiSchema = {
  'ui:title': 'Other living expenses',
  hasOtherExpenses: {
    'ui:title': 'Do you have any additional living expenses to include?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasOtherExpenses: {
      type: 'boolean',
    },
  },
};
