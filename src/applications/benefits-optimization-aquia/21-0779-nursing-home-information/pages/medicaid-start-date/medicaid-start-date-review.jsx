import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '@bio-aquia/21-0779-nursing-home-information/utils';

/**
 * Medicaid Start Date Review component
 * Displays medicaid start date information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for medicaid start date
 */
export const MedicaidStartDateReview = ({ data, editPage, title }) => {
  const { medicaidStartDate } = data?.medicaidStartDateInfo || {};

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
          <dt>When did the patient’s Medicaid plan begin?</dt>
          <dd>{formatDate(medicaidStartDate)}</dd>
        </div>
      </dl>
    </div>
  );
};

MedicaidStartDateReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
