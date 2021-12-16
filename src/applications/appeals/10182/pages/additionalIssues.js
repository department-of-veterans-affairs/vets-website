import AddIssuesField from '../components/AddIssuesField';

import {
  AdditionalIssuesLabel,
  missingIssueErrorMessage,
  missingIssuesErrorMessage,
} from '../content/additionalIssues';

import { IssueCard } from '../components/IssueCard';
import {
  requireIssue,
  validateDate,
  validAdditionalIssue,
  uniqueIssue,
  maxIssues,
} from '../validations';
import { SELECTED } from '../constants';
import { setInitialEditMode, showAddIssuesPage } from '../utils/helpers';

import dateUiSchema from 'platform/forms-system/src/js/definitions/date';

export default {
  uiSchema: {
    'ui:title': AdditionalIssuesLabel,
    'ui:validations': [requireIssue, validAdditionalIssue, maxIssues],
    additionalIssues: {
      'ui:title': '',
      'ui:field': AddIssuesField,
      'ui:options': {
        viewField: IssueCard,
        itemName: 'issue',
        keepInPageOnReview: true,
        setInitialEditMode,
        updateSchema: (formData, schema) => ({
          ...schema,
          minItems: showAddIssuesPage(formData) ? 1 : 0,
        }),
      },
      'ui:required': showAddIssuesPage,
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
      additionalIssues: {
        type: 'array',
        maxItems: 100,
        minItems: 1,
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
    },
  },
};
