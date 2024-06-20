import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { content } from '../content/extensionRequest';
import { SHOW_PART3, SHOW_PART3_REDIRECT } from '../constants';

const requestExtension = {
  uiSchema: {
    'ui:title': content.title,
    'view:requestExtensionInfo': {
      'ui:option': {
        forceDivWrapper: true,
      },
    },
    requestingExtension: yesNoUI({
      title: content.label,
      enableAnalytics: true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      uswds: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      'view:requestExtensionInfo': {
        type: 'object',
        properties: {},
      },
      requestingExtension: yesNoSchema,
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
