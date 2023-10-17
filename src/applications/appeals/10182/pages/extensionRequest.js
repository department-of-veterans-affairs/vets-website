import { content } from '../content/extensionRequest';

const requestExtension = {
  uiSchema: {
    'ui:title': ' ',
    'view:requestExtensionInfo': {
      'ui:title': content.title,
      'ui:description': content.description,
      'ui:options': {
        forceDivWrap: true,
      },
    },
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
      'view:requestExtensionInfo': {
        type: 'object',
        properties: {},
      },
      requestingExtension: {
        type: 'boolean',
      },
    },
  },
};

export default requestExtension;
