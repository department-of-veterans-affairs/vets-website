import React from 'react';
import { ENROLLMENTS_TYPE, formatNumericalDate } from '../helpers';

export default function EnrollmentVerificationMonthInfo({ enrollments }) {
  const enrollmentInstitutions = enrollments?.enrollments?.map(
    (enrollment, index) => {
      return (
        <li className="ev-month-info-institutions_institution" key={index}>
          <p className="vads-u-margin-y--0">
            <strong>
              {formatNumericalDate(enrollments.certifiedBeginDate)} &ndash;{' '}
              {formatNumericalDate(enrollments.certifiedEndDate)}
            </strong>{' '}
            at {enrollment.facilityName}
          </p>
          <p className="vads-u-margin-y--0">
            <strong>Total credit hours:</strong> {enrollment.totalCreditHours}
          </p>
        </li>
      );
    },
  );

  return (
    <ul className="ev-month-info-institutions vads-u-margin-y--0 vads-u-padding-left--0">
      {enrollmentInstitutions}
    </ul>
  );
}

EnrollmentVerificationMonthInfo.propTypes = {
  enrollments: ENROLLMENTS_TYPE,
};
