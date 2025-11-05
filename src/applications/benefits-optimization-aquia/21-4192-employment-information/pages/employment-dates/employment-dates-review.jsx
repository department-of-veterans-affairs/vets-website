import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Dates Review component
 * Displays employment dates and currently employed status on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment dates
 */
export const EmploymentDatesReview = ({ data, editPage, title }) => {
  const employmentDates = data?.employmentDates || {};
  const veteranInfo = data?.veteranInformation || {};
  const employerName =
    data?.employerInformation?.employerName || 'this employer';

  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'Veteran';

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
          <dt>
            When did {veteranName} start working for {employerName}?
          </dt>
          <dd>{formatDate(employmentDates.beginningDate)}</dd>
        </div>

        <div className="review-row">
          <dt>Currently employed</dt>
          <dd>{employmentDates.currentlyEmployed ? 'Yes' : 'No'}</dd>
        </div>

        {!employmentDates.currentlyEmployed && (
          <div className="review-row">
            <dt>
              When did {veteranName} stop working for {employerName}?
            </dt>
            <dd>{formatDate(employmentDates.endingDate)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

EmploymentDatesReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentDatesReview;
