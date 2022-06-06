import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const HIGH_DISABILITY = 'Yes (50% or higher rating)';
const LOW_DISABILITY = 'Yes (40% or lower rating)';
const NO_DISABILITY = 'No';

const CompensationTypeReviewPage = props => {
  const { data } = props;
  let compensationType = NO_DISABILITY;
  if (data.vaCompensationType === 'highDisability') {
    compensationType = HIGH_DISABILITY;
  } else if (data.vaCompensationType === 'lowDisability') {
    compensationType = LOW_DISABILITY;
  }

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Current compensation from VA
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Do you receive VA disability compensation?</dt>
            <dd>{compensationType}</dd>
          </div>
        </dl>
        <p className="vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
          If you need to edit this information, we’ll take you back to this
          question in the form. We may need to ask you more questions.
          <br />
          <br />
          <Link to="/va-benefits/basic-information">
            Go back to edit compensation information
          </Link>
        </p>
        <div />
      </form>
    </div>
  );
};

export default CompensationTypeReviewPage;

CompensationTypeReviewPage.propTypes = {
  data: PropTypes.object,
  props: PropTypes.object,
};
