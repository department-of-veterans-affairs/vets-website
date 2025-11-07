import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Concessions Review component
 * Displays concessions information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment concessions
 */
export const EmploymentConcessionsReview = ({ data, editPage, title }) => {
  const employmentConcessions = data?.employmentConcessions || {};
  const veteranInfo = data?.veteranInformation || {};

  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  // Determine if currently employed to use correct tense
  const currentlyEmployed = data?.employmentDates?.currentlyEmployed || false;
  const tense = currentlyEmployed ? 'are' : 'were';

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
            What concessions (if any) {tense} made to {veteranName} because of
            age or disability?
          </dt>
          <dd>{employmentConcessions.concessions || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

EmploymentConcessionsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentConcessionsReview;
