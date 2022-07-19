export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      'ui:title':
        'Are you experiencing homelessness or at risk of becoming homeless?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['homeless'],
    properties: {
      homeless: {
        type: 'boolean',
      },
    },
  },
};
