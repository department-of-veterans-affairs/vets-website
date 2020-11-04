import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const OfficeForReviewAlert = (
  <AlertBox
    status="info"
    headline="We will try to fulfill your request"
    className="vads-u-margin-left--3 vads-u-margin-top--0 vads-u-font-weight--normal"
    content={
      <>
        <p>
          Some issues can only be processed at the office that issued your prior
          decision. And some decisions are only processed at one VA office or
          facility.
        </p>
        <p>
          If we cannot fulfill your request, we will notify you at the time the
          Higher-Level Review decision is made.
        </p>
      </>
    }
  />
);

export const OfficeForReviewTitle = (
  <strong className="normal-weight-in-review">
    If possible, I would like the same office conduct this review.
  </strong>
);

export const OfficeForReviewDescription = (
  <p className="vads-u-margin-left--3">
    You have the right to request the same office conduct the review. VA may be
    unable to grant this request.
  </p>
);
