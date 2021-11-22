export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      'ui:title': 'Are you experiencing homelessness?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      homeless: {
        type: 'boolean',
      },
    },
  },
};
