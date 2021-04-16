import React from 'react';

/* eslint-disable camelcase */
export const boardReviewContent = {
  direct_review: (
    <>
      <strong>Direct review</strong>
      <p className="hide-on-review">
        A Veterans Law Judge will review your appeal based on evidence already
        submitted. You can’t submit more evidence or have a hearing. Direct
        review is often the fastest way to get a Board decision.
      </p>
    </>
  ),

  evidence_submission: (
    <>
      <strong>Submit additional evidence</strong>
      <p className="hide-on-review">
        You can submit more evidence for Veterans Law Judge to review, but you
        can’t have a hearing. When you choose this option, it’ll take longer for
        you to get a Board decision.
      </p>
    </>
  ),

  hearing: (
    <>
      <strong>Hearing with a Veterans Law Judge</strong>
      <p className="hide-on-review">
        You can request a hearing with a Veterans Law Judge. You can also submit
        more evidence to be reviewed, either at the hearing or within 90 days
        after the hearing. Adding evidence is optional. When you choose this
        option, it’ll take longer for you to get a Board decision.
      </p>
    </>
  ),
};
