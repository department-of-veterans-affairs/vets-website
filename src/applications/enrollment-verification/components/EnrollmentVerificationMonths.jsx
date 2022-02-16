import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Pagination from '@department-of-veterans-affairs/component-library/Pagination';

import EnrollmentVerificationMonth from './EnrollmentVerificationMonth';

const MONTHS_PER_PAGE = 6;

function EnrollmentVerificationMonths({ status }) {
  // TODO Do months come sorted?  If not, sort here.

  const months = status.months.map((month, index) => {
    return (
      <EnrollmentVerificationMonth
        key={index}
        month={month}
        paymentStatus={status.paymentStatus}
      />
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const onPageSelect = useCallback(
    newPage => {
      setCurrentPage(newPage);
    },
    [setCurrentPage],
  );

  const lowerDisplayedRange = MONTHS_PER_PAGE * (currentPage - 1) + 1;
  const upperDisplayedRange = Math.min(
    currentPage * MONTHS_PER_PAGE,
    months?.length,
  );
  const numPages = Math.ceil(months?.length / MONTHS_PER_PAGE);
  const minMonth = (currentPage - 1) * MONTHS_PER_PAGE;
  const maxMonth = currentPage * MONTHS_PER_PAGE;

  return (
    <>
      <h2>Your monthly enrollment verifications</h2>
      <va-additional-info trigger="What if I notice an error with my enrollment information?">
        <ul>
          <li>
            Work with your School Certifying Official (SCO) to make sure they
            have the correct enrollment information and can update the
            information on file.
          </li>
          <li>
            After your information is corrected, verify the corrected
            information.
          </li>
        </ul>
        <p>
          If you notice a mistake, it’s best if you reach out to your SCO soon.
          The sooner VA knows about changes to your enrollment, the less likely
          you are to be overpaid and incur a debt.
        </p>
      </va-additional-info>

      <p>
        Showing {lowerDisplayedRange}-{upperDisplayedRange} of {months?.length}{' '}
        monthly enrollments listed by most recent
      </p>

      {months?.slice(minMonth, maxMonth)}

      <Pagination
        onPageSelect={onPageSelect}
        page={currentPage}
        pages={numPages}
      />
    </>
  );
}

export default EnrollmentVerificationMonths;

EnrollmentVerificationMonths.propTypes = {
  status: PropTypes.shape({
    months: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string.isRequired,
        verified: PropTypes.bool.isRequired,
        enrollments: PropTypes.arrayOf(
          PropTypes.shape({
            institution: PropTypes.string.isRequired,
            creditHours: PropTypes.number.isRequired,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
    paymentStatus: PropTypes.string,
  }).isRequired,
};
