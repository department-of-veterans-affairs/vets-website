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

export const notActiveBenefitNotice = (
  <p>
    <strong>Note: </strong>
    Your eligibility for monthly housing allowance may be affected if you're
    called to active duty while receiving VET TEC benefits. Please let us know
    as soon as possible if there's a change in your military status.
  </p>
);

export const selectedReserveNationalGuardExpectedDutyTitle = (
  <p>
    Are you in the Selected Reserve or National Guard <strong>and</strong> do
    you expect to be called to duty for 30 days or more?
  </p>
);

export const remainingDaysGreaterThan180Notice = (
  <p>
    VET TEC is only available to Veterans or service members within 180 days of
    their release from active duty. Please consider submitting your VET TEC
    application when you're within 180 days of separating from service, or are
    no longer on active duty.
  </p>
);

export const remainingDaysNotGreaterThan180Notice = (
  <div>
    <p>
      We may contact you to verify that your expected release from active duty
      is within 180 days from this application's date. If we contact you, we may
      ask for a copy of your DD214 or a certification of your expected release
      date. You can request that certification from your Military Personnel
      Office.
    </p>
    <p>You'll need an honorable discharge to be eligible for VET TEC.</p>
  </div>
);
