import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import {
  homelessTitle,
  homelessReviewField,
} from '../../shared/content/homeless';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      ...yesNoUI({
        title: homelessTitle,
        enableAnalytics: true,
        labelHeaderLevel: '3',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        uswds: true,
      }),
      'ui:reviewField': homelessReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      homeless: yesNoSchema,
    },
  },
};
