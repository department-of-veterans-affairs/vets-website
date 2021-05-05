import EligibleIssuesWidget from '../components/EligibleIssuesWidget';
import NewIssuesField from '../components/NewIssuesField';

import {
  EligibleIssuesTitle,
  EligibleIssuesDescription,
  NewIssueDescription,
  missingIssueErrorMessage,
  missingIssuesErrorMessage,
} from '../content/contestableIssues';

import { requireIssue, optInValidation } from '../validations';
import { SELECTED } from '../constants';
import { setInitialEditMode } from '../utils/helpers';

import dateUiSchema from 'platform/forms-system/src/js/definitions/date';

import {
  optInDescription,
  OptInTitle,
  optInErrorMessage,
} from '../content/OptIn';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': EligibleIssuesDescription,
    contestableIssues: {
      'ui:title': EligibleIssuesTitle, // not rendering?
      'ui:field': 'StringField',
      'ui:widget': EligibleIssuesWidget,
      'ui:options': {
        keepInPageOnReview: true,
      },
      'ui:errorMessages': {
        required: missingIssuesErrorMessage,
      },
      'ui:required': () => true,
      'ui:validations': [requireIssue],
    },
    additionalIssues: {
      'ui:title': '',
      'ui:description': NewIssueDescription,
      'ui:field': NewIssuesField,
      'ui:options': {
        keepInPageOnReview: true,
        setInitialEditMode,
      },
      items: {
        issue: {
          'ui:title': 'Name of issue',
          'ui:errorMessages': {
            required: missingIssueErrorMessage,
          },
        },
        decisionDate: dateUiSchema('Date of decision'),
      },
    },
    socOptIn: {
      'ui:title': OptInTitle,
      // 'ui:description': optInDescription,
      'ui:required': () => true,
      'ui:validations': [optInValidation],
      'ui:errorMessages': {
        enum: optInErrorMessage,
        required: optInErrorMessage,
      },
      'ui:options': {
        showFieldLabel: 'label',
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
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            ratingIssueSubjectText: {
              type: 'string',
            },
            approxDecisionDate: {
              type: 'string',
            },
          },
          [SELECTED]: 'boolean',
        },
      },
      additionalIssues: {
        type: 'array',
        maxItems: 100,
        items: {
          type: 'object',
          required: ['issue', 'decisionDate'],
          properties: {
            issue: {
              type: 'string',
            },
            decisionDate: {
              type: 'string',
            },
          },
          [SELECTED]: 'boolean',
        },
      },
      socOptIn: {
        type: 'boolean',
        enum: [true],
        enumNames: ['Yes'],
      },
      'view:socOptInDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};
