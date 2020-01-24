import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const OfficeForReviewTitle = (
  <>
    Would you like the same office that issued your prior decision to conduct
    the Higher-Level Review?
  </>
);

export const OfficeForReviewChoiceAlert = () => (
  <AlertBox
    status="info"
    className="contested-issues-information"
    headline="We will try to fulfill your request"
    content={
      <>
        Some issues can only be reviewed at the office that issued your prior
        decision. And some decisions are only processed at one VA office or
        facility.
        <br />
        <p>
          If we can’t fulfill your request, we will notify you at the time the
          Higher-Level Review decision is made.
        </p>
      </>
    }
  />
);
