import EligibleIssuesWidget from '../components/EligibleIssuesWidget';

import {
  EligibleIssuesTitle,
  EligibleIssuesDescription,
} from '../content/contestableIssues';

import { requireIssue, optInValidation } from '../validations';
import { SELECTED } from '../constants';
import {
  optInDescription,
  OptInTitle,
  optInErrorMessage,
} from '../content/OptIn';
// import OptInWidget from '../components/OptInWidget';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': EligibleIssuesDescription,
    'ui:options': {
      itemName: 'issues eligible for review',
    },
    'ui:validations': [requireIssue],
    contestableIssues: {
      'ui:title': EligibleIssuesTitle,
      'ui:field': 'StringField',
      'ui:widget': EligibleIssuesWidget,
      'ui:options': {
        keepInPageOnReview: true,
      },
      'ui:required': () => true,
    },
    socOptIn: {
      'ui:title': OptInTitle,
      'ui:description': optInDescription,
      'ui:required': () => true,
      'ui:validations': [optInValidation],
      'ui:errorMessages': {
        enum: optInErrorMessage,
        required: optInErrorMessage,
      },
      'ui:options': {
        showFieldLabel: false,
        forceNoWrapper: true,
        keepInPageOnReview: false,
      },
    },
    'view:socOptInDescription': {
      'ui:description': optInDescription,
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestableIssues: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {},
          [SELECTED]: 'boolean',
        },
      },
      socOptIn: {
        type: 'boolean',
        enum: [true],
      },
      'view:socOptInDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};
