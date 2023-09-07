import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const ExpenseExplainerReview = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    goToPath('/expenses-explainer');
  };

  return (
    <ReviewPageHeader title="household expenses" goToPath={onReviewClick} />
  );
};

ExpenseExplainerReview.propTypes = {
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
  }),
  goToPath: PropTypes.func,
};

export default ExpenseExplainerReview;
