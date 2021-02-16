export const uiSchema = {
  'ui:title': 'Your real estate assets',
  hasOtherAssets: {
    'ui:title': 'Do you currently own other assets?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasOtherAssets: {
      type: 'boolean',
    },
  },
};
