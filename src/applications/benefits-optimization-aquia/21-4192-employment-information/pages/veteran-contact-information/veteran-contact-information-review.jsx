import PropTypes from 'prop-types';
import React from 'react';

/**
 * Veteran Contact Information Review component
 * Displays veteran SSN and VA file number on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for veteran contact information
 */
export const VeteranContactInformationReview = ({ data, editPage, title }) => {
  const veteranContactInfo = data?.veteranContactInformation || {};

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
          <dt>Social security number</dt>
          <dd>{veteranContactInfo.ssn || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>VA file number (if applicable)</dt>
          <dd>{veteranContactInfo.vaFileNumber || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

VeteranContactInformationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default VeteranContactInformationReview;
