import React from 'react';

/* eslint-disable camelcase */
export const boardReviewContent = {
  direct_review: (
    <>
      <strong>Request a direct review</strong>
      <p className="hide-on-review">
        A Veterans Law Judge will review your appeal based on evidence already
        submitted. You can’t submit more evidence or have a hearing. The Direct
        review option will take about <strong>1 year</strong> for the Board to
        complete.
      </p>
    </>
  ),

  evidence_submission: (
    <>
      <strong>Submit more evidence</strong>
      <p className="hide-on-review">
        You can submit more evidence for Veterans Law Judge to review, but you
        can’t have a hearing. The evidence submission option will take{' '}
        <strong>more than 1 year</strong> for the Board to complete.
      </p>
    </>
  ),

  hearing: (
    <>
      <strong>Request a hearing</strong>
      <p className="hide-on-review">
        You can request a hearing with a Veterans Law Judge. You can also submit
        more evidence to be reviewed, either at the hearing or within 90 days
        after the hearing. Adding evidence is optional. The hearing request
        option will take <strong>more than 1 year</strong> for the Board to
        complete.
      </p>
    </>
  ),
};
