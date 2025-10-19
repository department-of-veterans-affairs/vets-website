import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Dates and Details Review component
 * Displays employment dates, work details, and hours information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment dates and details
 */
export const EmploymentDatesDetailsReview = ({ data, editPage, title }) => {
  const employmentDetails = data?.employmentDatesDetails || {};

  const formatDate = dateString => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
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
          <dt>Beginning date</dt>
          <dd>{formatDate(employmentDetails.beginningDate)}</dd>
        </div>

        <div className="review-row">
          <dt>Ending date</dt>
          <dd>{formatDate(employmentDetails.endingDate)}</dd>
        </div>

        <div className="review-row">
          <dt>Type of work</dt>
          <dd>{employmentDetails.typeOfWork || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Amount earned during the period</dt>
          <dd>{employmentDetails.amountEarned || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Time lost</dt>
          <dd>{employmentDetails.timeLost || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Daily hours</dt>
          <dd>{employmentDetails.dailyHours || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Weekly hours</dt>
          <dd>{employmentDetails.weeklyHours || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

EmploymentDatesDetailsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentDatesDetailsReview;
