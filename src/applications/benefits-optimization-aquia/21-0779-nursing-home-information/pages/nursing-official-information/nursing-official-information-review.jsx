import PropTypes from 'prop-types';
import React from 'react';

/**
 * Nursing Official Information Review component
 * Displays nursing home official information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for nursing official information
 */
export const NursingOfficialInformationReview = ({ data, editPage, title }) => {
  const { firstName, lastName, jobTitle, phoneNumber } =
    data?.nursingOfficialInformation || {};

  const formatName = (first, last) => {
    if (!first && !last) return 'Not provided';
    return `${first || ''} ${last || ''}`.trim();
  };

  const formatPhone = phone => {
    if (!phone) return 'Not provided';
    // Format phone number if it's a 10-digit number
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
      )}`;
    }
    return phone;
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
          <dt>Name</dt>
          <dd>{formatName(firstName, lastName)}</dd>
        </div>
        <div className="review-row">
          <dt>Job title</dt>
          <dd>{jobTitle || 'Not provided'}</dd>
        </div>
        <div className="review-row">
          <dt>Phone number</dt>
          <dd>{formatPhone(phoneNumber)}</dd>
        </div>
      </dl>
    </div>
  );
};

NursingOfficialInformationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
