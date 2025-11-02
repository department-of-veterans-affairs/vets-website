import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '@bio-aquia/21-0779-nursing-home-information/utils';

/**
 * Admission Date Review component
 * Displays admission date information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for admission date
 */
export const AdmissionDateReview = ({ data, editPage, title }) => {
  const { admissionDate } = data?.admissionDateInfo || {};

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
          <dt>Date of admission to nursing home</dt>
          <dd>{formatDate(admissionDate)}</dd>
        </div>
      </dl>
    </div>
  );
};

AdmissionDateReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
