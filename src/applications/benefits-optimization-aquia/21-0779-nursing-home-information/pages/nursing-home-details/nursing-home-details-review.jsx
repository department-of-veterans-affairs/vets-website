import PropTypes from 'prop-types';
import React from 'react';

/**
 * Nursing Home Details Review component
 * Displays nursing home facility details on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for nursing home details
 */
export const NursingHomeDetailsReview = ({ data, editPage, title }) => {
  const { nursingHomeName, nursingHomeAddress } =
    data?.nursingHomeDetails || {};

  const formatAddress = address => {
    if (!address) return 'Not provided';

    const { street, city, state, postalCode } = address;
    if (!street && !city && !state && !postalCode) return 'Not provided';

    const parts = [];
    if (street) parts.push(street);
    if (city && state) {
      parts.push(`${city}, ${state}`);
    } else if (city) {
      parts.push(city);
    } else if (state) {
      parts.push(state);
    }
    if (postalCode) parts.push(postalCode);

    return parts.length > 0 ? parts.join('\n') : 'Not provided';
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
          <dt>Nursing home name</dt>
          <dd>{nursingHomeName || 'Not provided'}</dd>
        </div>
        <div className="review-row">
          <dt>Address</dt>
          <dd style={{ whiteSpace: 'pre-line' }}>
            {formatAddress(nursingHomeAddress)}
          </dd>
        </div>
      </dl>
    </div>
  );
};

NursingHomeDetailsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
