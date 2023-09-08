import { content } from '../content/extensionRequest';

const requestExtension = {
  uiSchema: {
    'ui:title': content.title,
    'ui:description': content.description,
    requestingExtension: {
      'ui:title': content.label,
      'ui:widget': 'yesNo',
      'ui:options': {
        enableAnalytics: true,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      requestingExtension: {
        type: 'boolean',
      },
    },
  },

  review: data => ({
    'Are you requesting an extension?': data.requestExtension ? 'Yes' : 'No',
  }),
};

export default requestExtension;
