import { content } from '../content/extensionRequest';
import { SHOW_PART3, SHOW_PART3_REDIRECT } from '../constants';

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

  // Set redirect flag to prevent multiple redirects
  onContinue: (formData, setFormData) => {
    // Clear form redirect flag after this page is viewed
    if (formData[SHOW_PART3] && formData[SHOW_PART3_REDIRECT] !== 'done') {
      setFormData({
        ...formData,
        [SHOW_PART3_REDIRECT]: 'done',
      });
    }
  },
};

export default requestExtension;
