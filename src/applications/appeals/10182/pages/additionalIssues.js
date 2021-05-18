import AddIssuesField from '../components/AddIssuesField';

import {
  AdditionalIssuesLabel,
  missingIssueErrorMessage,
  missingIssuesErrorMessage,
} from '../content/additionalIssues';

import { IssueCard } from '../components/IssueCard';
import { requireIssue } from '../validations';
import { SELECTED } from '../constants';
import { setInitialEditMode, hasSomeSelected } from '../utils/helpers';

import dateUiSchema from 'platform/forms-system/src/js/definitions/date';

export default {
  uiSchema: {
    'ui:title': AdditionalIssuesLabel,
    'ui:validations': [requireIssue],
    additionalIssues: {
      'ui:title': '',
      'ui:field': AddIssuesField,
      'ui:options': {
        viewField: IssueCard,
        itemName: 'issue',
        keepInPageOnReview: true,
        setInitialEditMode,
      },
      'ui:required': !hasSomeSelected,
      'ui:errorMessages': {
        required: missingIssuesErrorMessage,
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
  },

  schema: {
    type: 'object',
    properties: {
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
    },
  },
};
