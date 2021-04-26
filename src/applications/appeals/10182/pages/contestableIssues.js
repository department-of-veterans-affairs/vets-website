import EligibleIssuesWidget from '../components/EligibleIssuesWidget';
import NewIssuesField from '../components/NewIssuesField';
// import CheckBoxWidget from 'platform/forms-system/src/js/widgets';
// import CheckboxReviewWidget from '../components/CheckboxReviewWidget';

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
    'ui:title': '',
    'ui:description': EligibleIssuesDescription,
    contestableIssues: {
      'ui:title': EligibleIssuesTitle,
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
      'ui:description': optInDescription,
      // 'ui:widget': CheckBoxWidget,
      // 'ui:reviewWidget': CheckboxReviewWidget,
      'ui:required': () => true,
      'ui:validations': [optInValidation],
      'ui:errorMessages': {
        enum: optInErrorMessage,
        required: optInErrorMessage,
      },
      'ui:options': {
        showFieldLabel: false,
        forceNoWrapper: true, // TO DO: FieldTemplate line 78 bypass boolean
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
          properties: {},
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
