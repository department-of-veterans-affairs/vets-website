import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

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
