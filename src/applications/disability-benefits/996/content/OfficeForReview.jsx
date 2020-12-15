import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const OfficeForReviewAlert = (
  <AlertBox
    status="info"
    headline="We will try to fulfill your request"
    className="vads-u-margin-left--3 vads-u-margin-top--0 vads-u-font-weight--normal"
    content={
      <p>
        If we cannot fulfill your request, we will notify you at the time the
        Higher-Level Review decision is made.
      </p>
    }
  />
);

export const OfficeForReviewTitle = (
  <strong className="normal-weight-in-review">
    If available, I would like the same office to conduct this review.
  </strong>
);

export const OfficeForReviewDescription = (
  <p className="vads-u-margin-left--3">
    You have the right to request the same office conduct the review. VA may be
    unable to grant this request. In either scenario, your case will be looked
    at by a different individual and considered separately from your original
    decision.
  </p>
);
