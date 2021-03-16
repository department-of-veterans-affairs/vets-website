export const uiSchema = {
  'ui:title': 'Your other assets',
  questions: {
    hasOtherAssets: {
      'ui:title':
        'Do you own any other items of value, like jewelry or art (called assets)?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasOtherAssets: {
          type: 'boolean',
        },
      },
    },
  },
};
