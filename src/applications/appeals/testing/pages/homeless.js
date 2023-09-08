import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import { content } from '../content/homeless';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: yesNoUI({
      title: content.title,
      enableAnalytics: true,
      labelHeaderLevel: '1',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeless: {
        type: 'boolean',
      },
    },
  },
  review: data => ({
    [content.title]: data.homeless ? 'Yes' : 'No',
  }),
};
