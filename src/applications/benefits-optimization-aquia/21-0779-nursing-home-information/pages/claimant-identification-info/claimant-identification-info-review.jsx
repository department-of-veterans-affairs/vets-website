import PropTypes from 'prop-types';
import React from 'react';

/**
 * Claimant Identification Info Review component
 * Displays claimant identification information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for claimant identification info
 */
export const ClaimantIdentificationInfoReview = ({ data, editPage, title }) => {
  const { claimantSsn, claimantVaFileNumber } =
    data?.claimantIdentificationInfo || {};

  const formatSSN = ssn => {
    if (!ssn) return 'Not provided';
    // Format SSN with asterisks for security, showing only last 4 digits
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `***-**-${cleaned.slice(-4)}`;
    }
    return '***-**-****';
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
          <dt>Social Security number</dt>
          <dd>{formatSSN(claimantSsn)}</dd>
        </div>
        <div className="review-row">
          <dt>VA file number</dt>
          <dd>{claimantVaFileNumber || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

ClaimantIdentificationInfoReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
