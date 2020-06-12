import React from 'react';

// background & foreground class names added to indicate this paragraphs needs
// an axeCheck color contrast exception
export const activeDutyNotice = (
  <p className="vads-u-background-color--white vads-u-color--gray-dark">
    VET TEC is available only to Veterans. If you’re an active-duty service
    member, please consider applying for VET TEC when you’re no longer on active
    duty.
  </p>
);

export const benefitNotice = (
  <p>
    <strong>Note: </strong>
    Your eligibility for VET TEC may be affected if you're called to active
    duty. Please let us know as soon as possible if there's a change in your
    military status.
  </p>
);

export const selectedReserveNationalGuardExpectedDutyTitle = (
  <p>
    Are you in the Selected Reserve or National Guard <strong>and</strong> do
    you expect to be called to duty for 30 days or more?
  </p>
);
