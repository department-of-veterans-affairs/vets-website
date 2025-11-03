import PropTypes from 'prop-types';
import React from 'react';

/**
 * Claimant Question Review component
 * Displays claimant question information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for claimant question
 */
export const ClaimantQuestionReview = ({ data, editPage, title }) => {
  const { patientType } = data?.claimantQuestion || {};

  const formatClaimant = value => {
    if (!value) return 'Not provided';
    return value === 'veteran'
      ? 'A Veteran'
      : 'The spouse or parent of a Veteran';
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
          <dt>Who is the patient in the nursing home facility?</dt>
          <dd>{formatClaimant(patientType)}</dd>
        </div>
      </dl>
    </div>
  );
};

ClaimantQuestionReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
