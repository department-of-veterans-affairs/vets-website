import { OptInDescription, OptInLabel } from '../content/OptIn';

export default {
  uiSchema: {
    'ui:title': OptInDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
    socOptIn: {
      'ui:title': OptInLabel,
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
        enumNames: ['Yes, I understand', 'No, I don’t want to opt in'],
      },
    },
  },
};
