import ContestableIssuesWidget from '../components/ContestableIssuesWidget';

import { ContestableIssuesAdditionalInfo } from '../content/contestableIssues';

import { selectionRequired, maxIssues } from '../../10182/validations/issues';

import { hasSomeSelected } from '../../shared/utils/issues';
import { SELECTED } from '../../shared/constants';

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
      'ui:validations': [selectionRequired, maxIssues],
    },
    'view:disabilitiesExplanation': {
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
      'view:disabilitiesExplanation': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contestableIssues;
