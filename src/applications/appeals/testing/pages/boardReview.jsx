import React from 'react';

import {
  boardReviewTitle,
  boardReviewContent,
  boardReviewErrorMessage,
  radioTitles,
} from '../content/boardReview';

const boardReview = {
  uiSchema: {
    boardReviewOption: {
      'ui:title': boardReviewTitle,
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

  review: data => {
    const option = radioTitles[data.boardReviewOption];
    return {
      'Selected Board review option': option || (
        <span className="usa-input-error-message">
          Missing Board review option
        </span>
      ),
    };
  },
};

export default boardReview;
