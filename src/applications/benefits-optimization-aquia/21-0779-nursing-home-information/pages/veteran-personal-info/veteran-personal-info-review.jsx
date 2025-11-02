import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '@bio-aquia/21-0779-nursing-home-information/utils';

/**
 * Veteran Personal Info Review component
 * Displays veteran personal information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for veteran personal info
 */
export const VeteranPersonalInfoReview = ({ data, editPage, title }) => {
  const { fullName, dateOfBirth } = data?.veteranPersonalInfo || {};

  const formatName = name => {
    if (!name) return 'Not provided';
    const { first, middle, last } = name;
    if (!first && !middle && !last) return 'Not provided';

    const parts = [];
    if (first) parts.push(first);
    if (middle) parts.push(middle);
    if (last) parts.push(last);

    return parts.length > 0 ? parts.join(' ') : 'Not provided';
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
          <dd>{formatName(fullName)}</dd>
        </div>
        <div className="review-row">
          <dt>Date of birth</dt>
          <dd>{formatDate(dateOfBirth)}</dd>
        </div>
      </dl>
    </div>
  );
};

VeteranPersonalInfoReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
