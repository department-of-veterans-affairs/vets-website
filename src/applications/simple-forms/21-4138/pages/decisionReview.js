import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  DECISION_REVIEW_TYPES,
  DECISION_REVIEW_TYPE_DESCRIPTIONS,
  DECISION_REVIEW_TYPE_LABELS,
} from '../config/constants';

/** @type {PageSchema} */
export const decisionReviewPage = {
  uiSchema: {
    ...titleUI(
      'What to know before you request a decision review',
      'Depending on the date of the decision, you may be able to choose from 3 decision review options to continue your case: a Supplemental Claim, a Higher-Level Review, or a Board Appeal. ',
      1,
      'vads-u-color--black',
    ),
    decisionDate: currentOrPastDateUI({
      title: 'When was your decision dated',
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      decisionDate: currentOrPastDateSchema,
    },
    required: ['decisionDate'],
  },
};

/** @type {PageSchema} */
export const decisionReviewTypePage = {
  uiSchema: {
    decisionReviewType: radioUI({
      title: 'Which description is true for you?',
      labels: DECISION_REVIEW_TYPE_LABELS,
      descriptions: DECISION_REVIEW_TYPE_DESCRIPTIONS,
      tile: true,
      errorMessages: {
        required: 'Select the description that is true for you',
      },
      labelHeaderLevel: '1',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      decisionReviewType: radioSchema(Object.values(DECISION_REVIEW_TYPES)),
    },
    required: ['decisionReviewType'],
  },
};
