import React from 'react';

export const BirthInfoDescription = () => (
  <>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
      Enter your place of birth, including city and state, province or region.
    </p>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-bottom--4"
    >
      We ask for place of birth as an identity marker for record keeping. This
      will not impact your health care eligibility.
    </va-additional-info>
  </>
);

export const ContactInfoDescription = () => (
  <div className="vads-u-margin-bottom--4">
    <p>
      Adding your email and phone number is optional. But this information helps
      us contact you faster if we need to follow up with you about your
      application. If you don’t add this information, we’ll use your address to
      contact you by mail.
    </p>
    <p>
      <strong>Note:</strong> We’ll always mail you a copy of our decision on
      your application for your records.
    </p>
  </div>
);
