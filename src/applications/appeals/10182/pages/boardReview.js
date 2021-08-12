import { boardReviewContent } from '../content/boardReview';

const boardReview = {
  uiSchema: {
    boardReviewOption: {
      'ui:title': 'Please select a board review option:',
      'ui:widget': 'radio',
      'ui:options': {
        labels: boardReviewContent,
      },
    },
  },

  schema: {
    type: 'object',
    required: ['boardReviewOption'],
    properties: {
      boardReviewOption: {
        type: 'string',
        enum: ['direct_review', 'evidence_submission', 'hearing'],
      },
    },
  },
};

export default boardReview;
