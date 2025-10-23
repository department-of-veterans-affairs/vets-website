import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const ExpenseExplainerReview = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  const { 'view:reviewPageNavigationToggle': showReviewNavigation } = data;

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

  return showReviewNavigation ? (
    <ReviewPageHeader title="household expenses" goToPath={onReviewClick} />
  ) : null;
};

ExpenseExplainerReview.propTypes = {
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goToPath: PropTypes.func,
};

export default ExpenseExplainerReview;
