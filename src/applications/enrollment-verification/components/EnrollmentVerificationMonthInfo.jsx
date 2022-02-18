import React from 'react';
import { ENROLLMENTS_TYPE, formatNumericalDate } from '../helpers';

export default function EnrollmentVerificationMonthInfo({ enrollments }) {
  const enrollmentInstitutions = enrollments?.map((enrollment, index) => {
    return (
      <li className="ev-month-info-institutions_institution" key={index}>
        <p className="vads-u-margin-y--0">
          <strong>
            {formatNumericalDate(enrollment.startDate)} &ndash;{' '}
            {formatNumericalDate(enrollment.endDate)}
          </strong>{' '}
          at {enrollment.institution}
        </p>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          <strong>Total credit hours:</strong> {enrollment.creditHours}
        </p>
      </li>
    );
  });

  return (
    <ul className="ev-month-info-institutions vads-u-padding-left--0">
      {enrollmentInstitutions}
    </ul>
  );
}

EnrollmentVerificationMonthInfo.propTypes = {
  enrollments: ENROLLMENTS_TYPE,
};
