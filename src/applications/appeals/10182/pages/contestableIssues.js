import EligibleIssuesWidget from '../components/EligibleIssuesWidget';

import {
  EligibleIssuesTitle,
  EligibleIssuesDescription,
  NotListedInfo,
} from '../content/contestableIssues';

import { SELECTED } from '../constants';

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
    },
    'view:notListed': {
      'ui:title': ' ',
      'ui:description': NotListedInfo,
      'ui:options': {
        forceDivWrapper: true,
      },
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
      'view:notListed': {
        type: 'object',
        properties: {},
      },
    },
  },
};
