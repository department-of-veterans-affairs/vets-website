import EligibleIssuesWidget from '../components/EligibleIssuesWidget';

import {
  ContestedIssuesTitle,
  disabilitiesExplanation,
} from '../content/contestedIssues';

import { requireRatedDisability } from '../validations';
import { SELECTED } from '../constants';

const contestedIssuesPage = {
  uiSchema: {
    'ui:title': ContestedIssuesTitle,
    'ui:options': {
      itemName: 'issues eligible for review',
    },
    contestedIssues: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': EligibleIssuesWidget,
      'ui:options': {
        keepInPageOnReview: true,
      },
      'ui:validations': [requireRatedDisability],
      'ui:required': () => true,
    },
    'view:disabilitiesExplanation': {
      'ui:description': disabilitiesExplanation,
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestedIssues: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
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

export default contestedIssuesPage;
