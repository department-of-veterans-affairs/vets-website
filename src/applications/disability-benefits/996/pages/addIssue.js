import { SELECTED } from '../constants';

import dateUiSchema from 'platform/forms-system/src/js/definitions/date';

/**
 * A CustomPage only needs/uses minimal uiSchema/schema
 */

export default {
  uiSchema: {
    'ui:title': '',
    addIssue: {
      'ui:title': '',
      items: {
        issue: {
          'ui:title': 'Name of issue',
        },
        decisionDate: {
          ...dateUiSchema('Date of decision'),
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
