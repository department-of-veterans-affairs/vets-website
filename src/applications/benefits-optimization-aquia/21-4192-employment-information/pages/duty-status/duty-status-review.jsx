import PropTypes from 'prop-types';
import React from 'react';

/**
 * Duty Status Review component
 * Displays Reserve/National Guard status on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for duty status
 */
export const DutyStatusReview = ({ data, editPage, title }) => {
  const dutyStatus = data?.dutyStatus || {};
  const veteranInfo = data?.veteranInformation || {};

  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  const formatYesNo = value => {
    if (!value) return 'Not provided';
    return value === 'yes' ? 'Yes' : 'No';
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
          <dt>Is {veteranName} currently in the Reserve or National Guard?</dt>
          <dd>{formatYesNo(dutyStatus.reserveOrGuardStatus)}</dd>
        </div>
      </dl>
    </div>
  );
};

DutyStatusReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DutyStatusReview;
