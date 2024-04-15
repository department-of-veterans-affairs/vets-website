import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

import {
  OptInDescription,
  OptInLabel,
  OptInSelections,
} from '../content/OptIn';

export default {
  uiSchema: {
    'ui:title': OptInDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
    socOptIn: {
      'ui:title': OptInLabel,
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      socOptIn: {
        type: 'boolean',
        enum: [true, false],
        enumNames: Object.values(OptInSelections),
      },
    },
  },
};
