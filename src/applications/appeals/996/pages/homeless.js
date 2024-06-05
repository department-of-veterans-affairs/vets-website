import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import errorMessages from '../../shared/content/errorMessages';
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
        required: () => true,
        errorMessages: {
          required: errorMessages.requiredYesNo,
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
