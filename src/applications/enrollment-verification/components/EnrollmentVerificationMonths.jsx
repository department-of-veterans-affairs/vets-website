import React, { useState, useCallback } from 'react';

import Pagination from '@department-of-veterans-affairs/component-library/Pagination';

import EnrollmentVerificationMonth from './EnrollmentVerificationMonth';

const MONTHS_PER_PAGE = 1;

export default function EnrollmentVerificationMonths({ status }) {
  // TODO Do months come sorted?  If not, sort here.

  const months = status?.months?.map((month, index) => {
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

  const lowerDisplayedRange = currentPage * (MONTHS_PER_PAGE - 1) + 1;
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
