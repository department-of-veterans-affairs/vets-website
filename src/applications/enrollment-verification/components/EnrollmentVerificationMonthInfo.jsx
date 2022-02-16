import React from 'react';
import { formatNumericalDate } from '../helpers';

export default function EnrollmentVerificationMonthInfo({ enrollments }) {
  const enrollmentInstitutions = enrollments?.map((enrollment, index) => {
    return (
      <li className="ev-month-info-institutions_institution" key={index}>
        <p>
          <strong>
            {formatNumericalDate(enrollment.startDate)} &ndash;{' '}
            {formatNumericalDate(enrollment.endDate)}
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
