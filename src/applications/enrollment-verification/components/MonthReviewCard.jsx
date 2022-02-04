import React from 'react';

import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';

export default function MonthReviewCard({ month, reviewPage = false }) {
  const reviewStatusText = <>TODO.</>;
  const infoText = (
    <>
      This is the enrollment information we have on file for you for{' '}
      {month.month}.
    </>
  );

  return (
    <div className="ev-highlighted-content-container">
      <header className="ev-highlighted-content-container_header">
        <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
          {month.month}
        </h1>
      </header>
      <div className="ev-highlighted-content-container_content">
        <p>{reviewPage ? reviewStatusText : infoText}</p>
        <div className="ev-info-block">
          <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
        </div>
      </div>
    </div>
  );
}
