import React from 'react';

export const boardReviewErrorMessage =
  'Please choose a Board review option to proceed';

/* eslint-disable camelcase */
export const boardReviewContent = {
  direct_review: (
    <>
      <strong>Request a direct review</strong>
      <p className="hide-on-review">
        A Veterans Law Judge will review your appeal based on evidence already
        submitted. Because the Board has all your evidence, choosing this option
        will often result in a faster decision. Based on current estimates, it
        takes the Board about <strong>1 year</strong> to make a decision for
        this type of appeal.
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
        Based on current estimates, it takes the Board{' '}
        <strong>more than 1.5 years</strong> to make a decision for this type of
        appeal.
      </p>
    </>
  ),

  hearing: (
    <>
      <strong>Request a hearing</strong>
      <p className="hide-on-review">
        You can request a Board hearing with a Veterans Law Judge and submit
        additional evidence within 90 days after your hearing. Please keep in
        mind that this option has the longest wait time for a decision because
        of the high number of pending hearing requests. Based on current
        estimates, it takes the Board <strong>more than 2 years</strong> to make
        a decision for this type of appeal.
      </p>
    </>
  ),
};
