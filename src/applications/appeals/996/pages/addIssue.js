import { MAX_LENGTH, SELECTED } from '../../shared/constants';

/**
 * A CustomPage only needs/uses minimal uiSchema/schema
 */

export default {
  // this uiSchema is completely ignored
  uiSchema: {
    addIssue: {
      'ui:title': '',
      items: {
        issue: {
          'ui:title': 'Name of issue',
        },
        decisionDate: {
          'ui:title': 'Date of notification of the decision',
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      addIssue: {
        type: 'array',
        maxItems: MAX_LENGTH.SELECTIONS,
        minItems: 1,
        items: {
          type: 'object',
          required: ['issue', 'decisionDate'],
          properties: {
            issue: {
              type: 'string',
              maxLength: MAX_LENGTH.ISSUE_NAME,
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
