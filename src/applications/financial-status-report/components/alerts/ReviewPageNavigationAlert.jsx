import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { setData } from 'platform/forms-system/src/js/actions';

const ReviewPageNavigationAlert = ({ data, title }) => {
  const dispatch = useDispatch();
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: false,
      }),
    );
  };

  return (
    <va-alert
      background-only
      class="vads-u-margin-y--1 vads-u-margin-bottom--2"
      status="info"
      data-testid="review-page-navigation-alert"
      uswds
    >
      <h4>Editing {title}</h4>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        You are currently editing the {title} section. Complete the entire
        sectionto return to the review page.
      </p>
      <Link
        id="review-and-submit"
        to="/review-and-submit"
        aria-label="return to the review page"
        onClick={onReviewClick}
      >
        Back to review page
      </Link>
    </va-alert>
  );
};

ReviewPageNavigationAlert.propTypes = {
  data: PropTypes.object,
  setFlag: PropTypes.func,
  title: PropTypes.string,
};

export default ReviewPageNavigationAlert;
