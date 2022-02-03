import React from 'react';

export default function EnrollmentVerificationMonthInfo({ enrollments }) {
  const enrollmentInstitutions = enrollments?.map((enrollment, index) => {
    return (
      <li className="ev-month-info-institutions_institution" key={index}>
        <p>
          <strong>
            {enrollment.startDate} &ndash; {enrollment.endDate}
          </strong>{' '}
          at {enrollment.institution}
        </p>
        <p>
          <strong>Total credit hours:</strong> {enrollment.creditHours}
        </p>
      </li>
    );
  });

  return (
    <ul className="ev-month-info-institutions">{enrollmentInstitutions}</ul>
  );
}
