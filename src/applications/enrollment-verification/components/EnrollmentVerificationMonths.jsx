import React from 'react';

import EnrollmentVerificationMonth from './EnrollmentVerificationMonth';

export default function EnrollmentVerificationMonths({ status }) {
  const months = status?.months?.map((month, index) => {
    return (
      <EnrollmentVerificationMonth
        key={index}
        month={month}
        paymentStatus={status.paymentStatus}
      />
    );
  });

  return (
    <>
      <h2>Your monthly enrollment verifications</h2>

      <p>
        Showing 1-10 of {months?.length} monthly enrollments listed by most
        recent
      </p>

      {months}
    </>
  );
}
