import PropTypes from 'prop-types';
import React from 'react';

/**
 * Medicaid Status Review component
 * Displays medicaid status information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for medicaid status
 */
export const MedicaidStatusReview = ({ data, editPage, title }) => {
  const { currentlyCoveredByMedicaid } = data?.medicaidStatus || {};

  const formatCoverageStatus = value => {
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
          <dt>Is the patient covered by Medicaid?</dt>
          <dd>{formatCoverageStatus(currentlyCoveredByMedicaid)}</dd>
        </div>
      </dl>
    </div>
  );
};

MedicaidStatusReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
