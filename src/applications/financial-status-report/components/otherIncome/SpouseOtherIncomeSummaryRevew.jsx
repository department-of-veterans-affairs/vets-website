import React from 'react';
import PropTypes from 'prop-types';
import OtherIncomeReviewSection from './OtherIncomeReviewSection';

const SpouseOtherIncomeSummaryReview = ({ data }) => {
  const { spAddlIncome = [] } = data.additionalIncome.spouse;

  return <div>{OtherIncomeReviewSection(spAddlIncome)}</div>;
};

SpouseOtherIncomeSummaryReview.propTypes = {
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      spouse: PropTypes.shape({
        spAddlIncome: PropTypes.array,
      }),
    }),
  }),
  title: PropTypes.string,
};

export default SpouseOtherIncomeSummaryReview;
