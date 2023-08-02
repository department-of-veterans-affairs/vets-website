import ContestableIssuesWidget from '../components/ContestableIssuesWidget';

import { ContestableIssuesAdditionalInfo } from '../content/contestableIssues';

import {
  checkIssues,
  selectionRequired,
  maxIssues,
} from '../validations/issues';
import { hasSomeSelected } from '../utils/helpers';
import { SELECTED } from '../constants';

/**
 * contestable issues with add issue link (list loop)
 */
const contestableIssues = {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      itemName: 'issues eligible for review',
      forceDivWrapper: true,
    },
    contestedIssues: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': ContestableIssuesWidget,
      'ui:required': formData => !hasSomeSelected(formData),
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: true,
        customTitle: 'Issues', // override DL wrapper
      },
      'ui:validations': [checkIssues, selectionRequired, maxIssues],
    },
    'view:issueNotListed': {
      'ui:description': ContestableIssuesAdditionalInfo,
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestedIssues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
          [SELECTED]: 'boolean',
        },
      },
      'view:issueNotListed': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contestableIssues;
