import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  optionIndicatorDescription,
  optionIndicatorLabel,
  optionIndicatorHint,
  optionIndicatorChoices,
  OptionIndicatorReviewField,
} from '../content/optionIndicator';

import { isOnReviewPage } from '../../shared/utils/helpers';

export default {
  uiSchema: {
    'view:vhaContent': {
      'ui:description': optionIndicatorDescription,
    },
    optionIndicator: {
      ...radioUI({
        title: optionIndicatorLabel,
        hint: optionIndicatorHint,
        classNames: 'vads-u-margin-bottom--4',
        enableAnalytics: true,
        labelHeaderLevel: '3',
        labels: optionIndicatorChoices,
        required: false,
        updateUiSchema: () => ({
          'ui:options': {
            labelHeaderLevel: isOnReviewPage() ? 4 : 3,
          },
        }),
      }),
      'ui:reviewField': OptionIndicatorReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:vhaContent': {
        type: 'object',
        properties: {},
      },
      optionIndicator: radioSchema(Object.keys(optionIndicatorChoices)),
    },
  },
};
