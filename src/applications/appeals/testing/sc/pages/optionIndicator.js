import {
  radioOptionalUI,
  radioOptionalSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  optionIndicatorDescription,
  optionIndicatorLabel,
  optionIndicatorHint,
  optionIndicatorChoices,
} from '../content/optionIndicator';

import { isOnReviewPage } from '../../../shared/utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:vhaContent': {
      'ui:description': optionIndicatorDescription,
    },
    optionIndicator: radioOptionalUI({
      title: optionIndicatorLabel,
      hint: optionIndicatorHint,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: optionIndicatorChoices,
      updateUiSchema: () => ({
        'ui:options': {
          labelHeaderLevel: isOnReviewPage() ? 4 : 3,
        },
      }),
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      'view:vhaContent': {
        type: 'object',
        properties: {},
      },
      optionIndicator: radioOptionalSchema(),
    },
  },
};
