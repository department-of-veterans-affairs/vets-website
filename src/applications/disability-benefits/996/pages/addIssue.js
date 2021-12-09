import AddIssue from '../components/AddIssue';

import {
  addIssueLabel,
  missingIssueErrorMessage,
  missingIssuesErrorMessage,
} from '../content/addIssue';

import { IssueCard } from '../components/IssueCardV1';
import {
  requireIssue,
  validateDate,
  validAdditionalIssue,
  uniqueIssue,
  maxIssues,
} from '../validations/issues';
import { SELECTED } from '../constants';
import { setInitialEditMode } from '../utils/helpers';

import dateUiSchema from 'platform/forms-system/src/js/definitions/date';

export default {
  uiSchema: {
    'ui:title': addIssueLabel,
    'ui:validations': [requireIssue, validAdditionalIssue, maxIssues],
    addIssue: {
      'ui:title': '',
      'ui:field': AddIssue,
      'ui:options': {
        viewField: IssueCard,
        itemName: 'issue',
        keepInPageOnReview: true,
        setInitialEditMode,
        updateSchema: (formData, schema) => ({
          ...schema,
          minItems: 1,
        }),
      },
      'ui:errorMessages': {
        required: missingIssuesErrorMessage,
        atLeastOne: missingIssuesErrorMessage,
      },
      items: {
        issue: {
          'ui:title': 'Name of issue',
          'ui:errorMessages': {
            required: missingIssueErrorMessage,
          },
          'ui:validations': [uniqueIssue],
        },
        decisionDate: {
          ...dateUiSchema('Date of decision'),
          'ui:validations': [validateDate],
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      addIssue: {
        type: 'array',
        maxItems: 100,
        minItems: 1,
        items: {
          type: 'object',
          required: ['issue', 'decisionDate'],
          properties: {
            issue: {
              type: 'string',
              maxLength: 140,
            },
            decisionDate: {
              type: 'string',
            },
          },
          [SELECTED]: 'boolean',
        },
      },
    },
  },
};
