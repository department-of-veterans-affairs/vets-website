import PropTypes from 'prop-types';
import React from 'react';

/**
 * Medicaid Application Review component
 * Displays medicaid application status information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for medicaid application status
 */
export const MedicaidApplicationReview = ({ data, editPage, title }) => {
  const { hasAppliedForMedicaid } = data?.medicaidApplication || {};

  const formatApplicationStatus = value => {
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
          <dt>Has the patient applied for Medicaid?</dt>
          <dd>{formatApplicationStatus(hasAppliedForMedicaid)}</dd>
        </div>
      </dl>
    </div>
  );
};

MedicaidApplicationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
