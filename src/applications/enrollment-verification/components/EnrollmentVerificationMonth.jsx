import React from 'react';

import EnrollmentVerificationMonthAdditionalInfo from './EnrollmentVerificationMonthAdditionalInfo';

export default function EnrollmentVerificationMonth({ month }) {
  return (
    <>
      <div className="ev-enrollment-month">
        <hr />
        <h3>{month.month}</h3>
        <p>
          <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
          Contact your School Certifying Official to update enrollment
          information
        </p>

        <EnrollmentVerificationMonthAdditionalInfo
          enrollments={month.enrollments}
        />
      </div>
    </>
  );
}
