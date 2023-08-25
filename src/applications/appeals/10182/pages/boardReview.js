import {
  boardReviewTitle,
  boardReviewContent,
  boardReviewErrorMessage,
  BoardReviewReviewField,
} from '../content/boardReview';

const boardReview = {
  uiSchema: {
    boardReviewOption: {
      'ui:title': boardReviewTitle,
      'ui:reviewField': BoardReviewReviewField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: boardReviewContent,
        enableAnalytics: true,
      },
      'ui:errorMessages': {
        required: boardReviewErrorMessage,
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
