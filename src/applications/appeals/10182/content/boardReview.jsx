import React from 'react';

export const boardReviewErrorMessage =
  'Choose a Board review option to proceed';

const title = 'Select a Board review option:';

export const boardReviewTitle = (
  <h3 className="vads-u-display--inline">{title}</h3>
);

/* eslint-disable camelcase */
export const boardReviewContent = {
  direct_review: (
    <>
      <strong>Request a direct review</strong>
      <p className="hide-on-review">
        A Veterans Law Judge will review your appeal based on evidence already
        submitted. Because the Board has all your evidence, choosing this option
        will often result in a faster decision.
      </p>
    </>
  ),

  evidence_submission: (
    <>
      <strong>Submit more evidence</strong>
      <p className="hide-on-review">
        You can submit additional evidence within 90 days after submitting your
        Board appeal. Choose this option if you want to turn in additional
        evidence but don’t want to wait for a hearing with a Veterans Law Judge.
        Choosing this option will extend the time it takes for the Board to
        decide your appeal.
      </p>
    </>
  ),

  hearing: (
    <>
      <strong>Request a hearing</strong>
      <p className="hide-on-review">
        You can request a Board hearing with a Veterans Law Judge and submit
        additional evidence within 90 days after your hearing. Keep in mind that
        this option has the longest wait time for a decision because there are
        currently tens of thousands of pending hearing requests.
      </p>
    </>
  ),
};
/* eslint-enable camelcase */

export const BoardReviewReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{title}</dt>
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
