import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employer Information Review component
 * Displays employer name and address on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employer information
 */
export const EmployerInformationReview = ({ data, editPage, title }) => {
  const employerInfo = data?.employerInformation || {};
  const address = employerInfo.employerAddress || {};

  const formatAddress = () => {
    const parts = [
      address.street,
      address.street2,
      address.city,
      [address.state, address.postalCode].filter(Boolean).join(' '),
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
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
          <dt>Name of employer</dt>
          <dd>{employerInfo.employerName || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>Employer’s address</dt>
          <dd>{formatAddress()}</dd>
        </div>
      </dl>
    </div>
  );
};

EmployerInformationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmployerInformationReview;
