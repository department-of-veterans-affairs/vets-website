import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { DECISION_REVIEW_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const decisionReviewPage = {
  uiSchema: {
    ...titleUI('There’s a better way to tell us you disagree with a decision'),
    'view:decisionReviewContent': { 'ui:description': DECISION_REVIEW_HANDOFF },
  },
  schema: {
    type: 'object',
    properties: {
      'view:decisionReviewContent': { type: 'object', properties: {} },
    },
  },
};
