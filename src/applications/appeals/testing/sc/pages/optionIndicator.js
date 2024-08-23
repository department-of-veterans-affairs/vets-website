import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  optionIndicatorDescription,
  optionIndicatorLabel,
  optionIndicatorHint,
  optionIndicatorChoices,
} from '../content/optionIndicator';

export default {
  uiSchema: {
    'view:vhaContent': {
      'ui:description': optionIndicatorDescription,
    },
    optionIndicator: radioUI({
      title: optionIndicatorLabel,
      hint: optionIndicatorHint,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: optionIndicatorChoices,
      required: false,
    }),
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
