import PropTypes from 'prop-types';
import React from 'react';

/**
 * Medicaid Facility Review component
 * Displays medicaid facility status information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for medicaid facility status
 */
export const MedicaidFacilityReview = ({ data, editPage, title }) => {
  const { isMedicaidApproved } = data?.medicaidFacility || {};

  const formatMedicaidApproved = value => {
    if (!value) return 'Not provided';
    return value === 'yes' ? 'Yes' : 'No';
  };

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
          <dt>Is the nursing home a Medicaid-approved facility?</dt>
          <dd>{formatMedicaidApproved(isMedicaidApproved)}</dd>
        </div>
      </dl>
    </div>
  );
};

MedicaidFacilityReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
