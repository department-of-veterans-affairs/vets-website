import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { content } from '../content/extensionRequest';

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
};

export default requestExtension;
