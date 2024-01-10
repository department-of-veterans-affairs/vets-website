import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const CompensationTypeReviewPage = ({ data }) => {
  const { vaCompensationType } = data;
  const labels = {
    highDisability: 'Yes (50% or higher rating)',
    lowDisability: 'Yes (40% or lower rating)',
    default: 'No',
  };
  const compensationType = labels[vaCompensationType] || labels.default;

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
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="VA disability compensation"
            >
              {compensationType}
            </dd>
          </div>
        </dl>
        <p className="vads-u-margin-top--1p5">
          If you need to edit this information, we’ll take you back to this
          question in the form. We may need to ask you more questions.
        </p>
        <p className="vads-u-margin-bottom--0p5">
          <Link to="/va-benefits/basic-information" data-testid="hca-nav-link">
            Go back to edit compensation information
          </Link>
        </p>
      </form>
    </div>
  );
};

CompensationTypeReviewPage.propTypes = {
  data: PropTypes.object,
};

export default CompensationTypeReviewPage;
