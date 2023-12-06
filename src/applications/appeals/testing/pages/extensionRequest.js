import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import { content } from '../content/extensionRequest';

const requestExtension = {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    requestingExtension: yesNoUI({
      title: content.title,
      hint: content.description,
      enableAnalytics: true,
      labelHeaderLevel: '1',
      uswds: true,
    }),
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
    [content.title]: data.requestingExtension ? 'Yes' : 'No',
  }),
};

export default requestExtension;
