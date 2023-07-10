import React from 'react';
import PropTypes from 'prop-types';
import OtherIncomeReviewSection from './OtherIncomeReviewSection';

const OtherIncomeSummaryReview = ({ data }) => {
  const { addlIncRecords = [] } = data.additionalIncome;

  return <div>{OtherIncomeReviewSection(addlIncRecords)}</div>;
};

OtherIncomeSummaryReview.propTypes = {
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
    }),
  }),
  title: PropTypes.string,
};

export default OtherIncomeSummaryReview;
