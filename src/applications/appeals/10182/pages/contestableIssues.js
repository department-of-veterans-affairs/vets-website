import EligibleIssuesWidget from '../components/EligibleIssuesWidget';
import NewIssuesField from '../components/NewIssuesField';
// import CheckBoxWidget from 'platform/forms-system/src/js/widgets';
// import CheckboxReviewWidget from '../components/CheckboxReviewWidget';

import {
  EligibleIssuesTitle,
  EligibleIssuesDescription,
  NewIssueDescription,
  missingConditionErrorMessage,
} from '../content/contestableIssues';

import { requireIssue, optInValidation } from '../validations';
import { SELECTED } from '../constants';

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
        required: 'Please select one of the eligible issues or add an issue',
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
        setInitialEditMode: formData =>
          formData.map(
            ({ condition, approxDecisionDate } = {}, index) =>
              index >= 0 && (!condition || !approxDecisionDate),
          ),
      },
      items: {
        condition: {
          'ui:title': 'Name of condition',
          'ui:errorMessages': {
            required: missingConditionErrorMessage,
          },
        },
        approxDecisionDate: dateUiSchema('Date of decision'),
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
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {},
          [SELECTED]: 'boolean',
        },
      },
      additionalIssues: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          required: ['condition', 'approxDecisionDate'],
          properties: {
            condition: {
              type: 'string',
            },
            approxDecisionDate: {
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
