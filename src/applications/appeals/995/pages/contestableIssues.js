import ContestableIssuesWidget from '../components/ContestableIssuesWidget';

import { ContestableIssuesAdditionalInfo } from '../../shared/content/contestableIssues';

import { checkIssues } from '../validations/issues';

import { SELECTED } from '../../shared/constants';
import { hasSomeSelected } from '../../shared/utils/issues';
import { selectionRequired, maxIssues } from '../../shared/validations/issues';

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
