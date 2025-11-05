import PropTypes from 'prop-types';
import React from 'react';

/**
 * Benefits Details Review component
 * Displays benefit details on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for benefits details
 */
export const BenefitsDetailsReview = ({ data, editPage, title }) => {
  const benefitsDetails = data?.benefitsDetails || {};

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <va-button secondary uswds text="Edit" onClick={editPage} />
      </div>

      <dl className="review">
        <div className="review-row">
          <dt>Benefit details</dt>
          <dd>{benefitsDetails.benefitDetails || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

BenefitsDetailsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default BenefitsDetailsReview;
