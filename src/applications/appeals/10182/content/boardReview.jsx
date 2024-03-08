import React from 'react';

export const boardReviewErrorMessage =
  'Choose a Board review option to proceed';

export const boardReviewTitle = 'Select a Board review option:';

/* eslint-disable camelcase */
export const boardReviewLabels = {
  direct_review: 'Request a direct review',
  evidence_submission: 'Submit more evidence',
  hearing: 'Request a hearing',
};
export const boardReviewDescriptions = {
  direct_review:
    'A Veterans Law Judge will review your appeal based on evidence already submitted. Because the Board has all your evidence, choosing this option will often result in a faster decision.',
  evidence_submission:
    'You can submit additional evidence within 90 days after submitting your Board appeal. Choose this option if you want to turn in additional evidence but don’t want to wait for a hearing with a Veterans Law Judge. Choosing this option will extend the time it takes for the Board to decide your appeal.',
  hearing:
    'You can request a Board hearing with a Veterans Law Judge and submit additional evidence within 90 days after your hearing. Keep in mind that this option has the longest wait time for a decision because there are currently tens of thousands of pending hearing requests.',
};
/* eslint-enable camelcase */

export const BoardReviewReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{boardReviewTitle}</dt>
    <dd>
      {children?.props?.formData ? (
        children
      ) : (
        <span className="usa-input-error-message">
          Missing Board review option
        </span>
      )}
    </dd>
  </div>
);
