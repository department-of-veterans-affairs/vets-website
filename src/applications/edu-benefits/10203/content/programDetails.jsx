import React from 'react';
import environment from 'platform/utilities/environment';

// prod flags 24612
const studentId = environment.isProduction()
  ? 'Your school ID and contact details'
  : 'Your student ID and contact details';
export const schoolStudentIdTitle = (
  <div className="program-details vads-u-margin-bottom--neg1">
    <p>
      <strong>{studentId}</strong>
    </p>
    <p className="school-details-notice">
      These details will help us review your application faster, but aren't
      required.
    </p>
  </div>
);

export const stemApplicantSco = (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="feature vads-u-margin-top--5" tabIndex="0">
    We’ll be reaching out to the School Certifying Official (SCO) at this school
    to confirm your eligibility for the scholarship.
  </div>
);
