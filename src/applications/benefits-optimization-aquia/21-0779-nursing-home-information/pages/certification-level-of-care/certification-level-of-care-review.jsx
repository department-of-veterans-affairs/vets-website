import PropTypes from 'prop-types';
import React from 'react';

/**
 * Certification Level of Care Review component
 * Displays level of care certification information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for certification level of care
 */
export const CertificationLevelOfCareReview = ({ data, editPage, title }) => {
  const { levelOfCare } = data?.certificationLevelOfCare || {};

  const formatLevelOfCare = level => {
    if (!level) return 'Not provided';
    return level === 'skilled'
      ? 'Skilled nursing care'
      : 'Intermediate nursing care';
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
          <dt>Level of care being provided</dt>
          <dd>{formatLevelOfCare(levelOfCare)}</dd>
        </div>
      </dl>
    </div>
  );
};

CertificationLevelOfCareReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
