import React from 'react';
import { formatNumericalDate, MONTH_PROP_TYPE } from '../helpers';

export default function EnrollmentVerificationMonthInfo({ month }) {
  const enrollmentInstitutions = month?.enrollments?.map(
    (enrollment, index) => {
      return (
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        <li
          className="ev-month-info-institutions_institution"
          key={index}
          tabIndex="0"
        >
          <p className="vads-u-margin-y--0">
            <strong>
              {formatNumericalDate(month.certifiedBeginDate)} &ndash;{' '}
              {formatNumericalDate(month.certifiedEndDate)}
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
  month: MONTH_PROP_TYPE,
};
