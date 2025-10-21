import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Termination Review component
 * Displays termination information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment termination
 */
export const EmploymentTerminationReview = ({ data, editPage, title }) => {
  const employmentTermination = data?.employmentTermination || {};

  const formatDate = dateString => {
    if (!dateString) return 'Not provided';
    try {
      // Parse date string as YYYY-MM-DD to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
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
          <dt>Reason for termination of employment</dt>
          <dd>{employmentTermination.terminationReason || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Date last worked</dt>
          <dd>{formatDate(employmentTermination.dateLastWorked)}</dd>
        </div>
      </dl>
    </div>
  );
};

EmploymentTerminationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentTerminationReview;
