import React from 'react';

export const firstSidebarBlock = {
  heading: 'What if I need to change my direct deposit or contact information?',
  content: (
    <>
      <p>
        You can sign in to VA.gov and change your address and other contact
        information. This will update your information across disability
        compensation, pension benefits, claims and appeals, Vocational
        Rehabilitation & Employment (VR&E), and VA health care.
      </p>
      <a href="/profile">Link to profile page</a>
    </>
  ),
};

export const secondSidebarBlock = {
  heading: 'What if I’m missing a payment?',
  content: (
    <>
      <p>
        Please wait at least 3 business days (Monday-Friday) before reporting
        non-receipt of a payment as check tracing cannot be initiated before
        that period. To report non-receipt after 3 business days, call
        <a href="tel:8008271000" aria-label="1. 800. 827. 1000.">
          800-827-1000
        </a>{' '}
        with your Social Security Number or VA Claim Number, your address, and
        (for direct deposit payments) your account information.
      </p>
    </>
  ),
};

export const thirdSidebarBlock = {
  heading: 'What if I have questions?',
  content: (
    <>
      <p>
        You can call us at{' '}
        <a href="tel:8008271000" aria-label="1. 800. 827. 1000.">
          800-827-1000
        </a>
        . We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.
      </p>
    </>
  ),
};
