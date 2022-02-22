import React from 'react';
import PropTypes from 'prop-types';
import { MONTH_PROP_TYPE } from '../helpers';

import MonthReviewCard from './MonthReviewCard';

export default function ReviewEnrollmentVerifications({
  months,
  informationIncorrectMonth,
  onEditMonth,
}) {
  const monthReviewCards = months?.map((month, index) => {
    return (
      <MonthReviewCard
        month={month}
        onEditMonth={onEditMonth}
        informationIncorrectMonth={informationIncorrectMonth}
        reviewPage="true"
        key={index}
      />
    );
  });

  return <>{monthReviewCards}</>;
}

ReviewEnrollmentVerifications.propTypes = {
  months: PropTypes.arrayOf(MONTH_PROP_TYPE).isRequired,
  onEditMonth: PropTypes.func.isRequired,
  informationIncorrectMonth: MONTH_PROP_TYPE,
};
