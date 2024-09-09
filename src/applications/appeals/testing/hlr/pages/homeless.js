import React from 'react';

import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import errorMessages from '../../../shared/content/errorMessages';
import {
  homelessTitle,
  homelessReviewField,
} from '../../../shared/content/homeless';

export const homelessPageTitle = (
  <h3 className="vads-u-margin--0">Housing situation</h3>
);

export const homelessDescription =
  'If you’re experiencing or at risk of homelessness, we’ll process your request more quickly.';

export default {
  uiSchema: {
    'ui:title': homelessPageTitle,
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      ...yesNoUI({
        title: homelessTitle,
        hint: homelessDescription,
        enableAnalytics: true,
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        required: () => true,
        errorMessages: {
          required: errorMessages.requiredYesNo,
        },
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
