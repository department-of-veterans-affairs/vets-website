import PropTypes from 'prop-types';
import React from 'react';

/**
 * Veteran Identification Info Review component
 * Displays veteran identification information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for veteran identification info
 */
export const VeteranIdentificationInfoReview = ({ data, editPage, title }) => {
  const { ssn, vaFileNumber } = data?.veteranIdentificationInfo || {};

  const formatSSN = toFormat => {
    if (!toFormat) return 'Not provided';
    // Format toFormat with asterisks for security, showing only last 4 digits
    const cleaned = toFormat.replace(/\D/g, '');
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
          <dd>{formatSSN(ssn)}</dd>
        </div>
        <div className="review-row">
          <dt>VA file number</dt>
          <dd>{vaFileNumber || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

VeteranIdentificationInfoReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
