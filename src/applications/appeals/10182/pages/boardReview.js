import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  boardReviewTitle,
  boardReviewLabels,
  boardReviewDescriptions,
  boardReviewErrorMessage,
  BoardReviewReviewField,
} from '../content/boardReview';

const boardReview = {
  uiSchema: {
    boardReviewOption: {
      ...radioUI({
        title: boardReviewTitle,
        labelHeaderLevel: '3',
        labels: boardReviewLabels,
        descriptions: boardReviewDescriptions,
        enableAnalytics: true,
        errorMessages: {
          required: boardReviewErrorMessage,
        },
      }),
      'ui:reviewField': BoardReviewReviewField,
    },
    // boardReviewOption: {
    //   'ui:title': boardReviewTitle,
    //   'ui:reviewField': BoardReviewReviewField,
    //   'ui:widget': 'radio',
    //   'ui:options': {
    //     labels: boardReviewContent,
    //     enableAnalytics: true,
    //   },
    //   'ui:errorMessages': {
    //     required: boardReviewErrorMessage,
    //   },
    // },
  },

  schema: {
    type: 'object',
    required: ['boardReviewOption'],
    properties: {
      boardReviewOption: radioSchema([
        'direct_review',
        'evidence_submission',
        'hearing',
      ]),
    },
  },
};

export default boardReview;
