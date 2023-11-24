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
      aria-labelledby="alertHeader"
      aria-live="polite"
      class="vads-u-margin-y--2"
      data-testid="review-page-navigation-alert"
      role="alertdialog"
      status="info"
      uswds
    >
      <h4
        id="alertHeader"
        slot="headline"
        className="vads-u-margin-top--0p5 vads-u-font-size--h4"
      >
        Editing {title}
      </h4>
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
