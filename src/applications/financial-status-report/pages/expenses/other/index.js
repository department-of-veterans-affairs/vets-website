export const uiSchema = {
  'ui:title': 'Other living expenses',
  hasOtherExpenses: {
    'ui:title':
      'Do you have any other living expenses (like clothing, transportation, child care, or health care costs)?',
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
