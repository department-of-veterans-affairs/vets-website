import { MAX_LENGTH, SELECTED } from '../constants';

/**
 * A CustomPage only needs/uses minimal uiSchema/schema
 */

export default (maxLength = null) => ({
  // this uiSchema is completely ignored
  uiSchema: {
    'ui:options': {
      focusOnAlertRole: true,
    },
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
              maxLength: maxLength || MAX_LENGTH.ISSUE_NAME,
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
});
