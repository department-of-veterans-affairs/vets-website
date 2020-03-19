import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const alert = (
  <AlertBox
    status="info"
    headline=""
    content={
      <>
        It is not always possible to get a review at a different office as some
        issues can only be processed at the office that issued your prior
        decision. And some decisions are only processed at one VA office or
        facility.
        <br />
        <br />
        But, please be aware that{' '}
        <strong>a different, higher-level, reviewer</strong> will be conducting
        this review
      </>
    }
  />
);

export const OfficeForReviewTitle = (
  <>
    <p className="vads-u-margin-top--0">
      You have the right to request another office (different from the office
      that issued your prior decision) to conduct the review.
    </p>
    {alert}
    <p>
      If we cannot fulfill your request, we will notify you at the time the
      Higher-Level Review decision is made.
    </p>
    If possible, would you like to have a different office conduct this review?
  </>
);
