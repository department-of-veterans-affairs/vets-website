import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const OfficeForReviewAlert = (
  <AlertBox
    status="info"
    headline="We’ll try to grant your request"
    className="vads-u-margin-left--3 vads-u-margin-top--0 vads-u-font-weight--normal"
    content={
      <p>
        If we can’t fulfill your request, we’ll let you know at the time we make
        a decision on your Higher-Level Review.
      </p>
    }
  />
);

export const OfficeForReviewTitle = (
  <strong className="normal-weight-in-review">
    I’d like the same office to do this review.
  </strong>
);

export const OfficeForReviewDescription = (
  <p className="vads-u-margin-left--3">
    You can request to have the same office conduct your Higher-Level Review. We
    might not be able to grant your request, however. Either way, a new reviewer
    will look at your case and consider it separately from your original
    decision.
  </p>
);
