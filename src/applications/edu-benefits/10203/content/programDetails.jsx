import React from 'react';

export const schoolStudentIdTitle = (
  <div className="program-details vads-u-margin-bottom--neg1">
    <p>
      <strong>Your student ID and contact details</strong>
    </p>
    <p className="school-details-notice">
      These details will help us review your application faster, but aren’t
      required.
    </p>
  </div>
);

export const stemApplicantSco = (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <va-summary-box
    class="vads-u-margin-top--5 vads-u-margin-bottom--3"
    tabIndex="0"
  >
    We’ll be reaching out to the School Certifying Official (SCO) at this school
    to confirm your eligibility for the scholarship.
  </va-summary-box>
);
