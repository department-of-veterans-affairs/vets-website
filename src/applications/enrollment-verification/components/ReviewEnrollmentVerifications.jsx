import React from 'react';

import MonthReviewCard from './MonthReviewCard';

export default function ReviewEnrollmentVerifications({
  months,
  informationIncorrectMonth,
}) {
  const monthReviewCards = months?.map((month, index) => {
    return (
      <MonthReviewCard
        month={month}
        informationIncorrectMonth={informationIncorrectMonth}
        reviewPage="true"
        key={index}
      />
    );
  });

  return <>{monthReviewCards}</>;
}
