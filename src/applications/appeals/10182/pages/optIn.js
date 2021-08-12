import {
  OptInDescription,
  optInErrorMessage,
  OptInReviewField,
} from '../content/OptIn';
import { optInValidation } from '../validations';
import OptInWidget from '../components/OptInWidget';

export default {
  uiSchema: {
    'ui:title': OptInDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
    socOptIn: {
      'ui:title': ' ',
      'ui:widget': OptInWidget,
      'ui:reviewField': OptInReviewField,
      'ui:required': () => true,
      'ui:validations': [optInValidation],
      'ui:errorMessages': {
        enum: optInErrorMessage,
        required: optInErrorMessage,
      },
      'ui:options': {
        showFieldLabel: false,
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
        enum: [true],
        enumNames: ['Yes'],
      },
    },
  },
};
