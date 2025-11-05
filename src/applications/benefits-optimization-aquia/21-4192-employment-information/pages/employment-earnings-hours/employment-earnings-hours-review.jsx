import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Earnings and Hours Review component
 * Displays earnings and hours information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment earnings and hours
 */
export const EmploymentEarningsHoursReview = ({ data, editPage, title }) => {
  const employmentEarningsHours = data?.employmentEarningsHours || {};

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
          <dt>Amount earned during the period</dt>
          <dd>{employmentEarningsHours.amountEarned || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Time lost</dt>
          <dd>{employmentEarningsHours.timeLost || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Daily hours</dt>
          <dd>{employmentEarningsHours.dailyHours || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Weekly hours</dt>
          <dd>{employmentEarningsHours.weeklyHours || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

EmploymentEarningsHoursReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentEarningsHoursReview;
