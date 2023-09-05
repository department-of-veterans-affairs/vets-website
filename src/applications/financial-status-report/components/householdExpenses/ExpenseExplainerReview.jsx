import React from 'react';
import PropTypes from 'prop-types';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const ExpenseExplainerReview = ({ goToPath }) => {
  return (
    <ReviewPageHeader
      title="household expenses"
      goToPath={() => goToPath('/expenses-explainer')}
    />
  );
};

ExpenseExplainerReview.propTypes = {
  goToPath: PropTypes.func,
};

export default ExpenseExplainerReview;
