import PropTypes from 'prop-types';
import React from 'react';

/**
 * Duty Status Details Review component
 * Displays duty status details on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for duty status details
 */
export const DutyStatusDetailsReview = ({ data, editPage, title }) => {
  const dutyStatusDetails = data?.dutyStatusDetails || {};
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
          <dt>
            What is {veteranName}
            's current duty status?
          </dt>
          <dd>{dutyStatusDetails.currentDutyStatus || 'Not provided'}</dd>
        </div>

        <div className="review-row">
          <dt>
            Does {veteranName} have any disabilities that prevent them from
            performing their military duties?
          </dt>
          <dd>{formatYesNo(dutyStatusDetails.disabilitiesPreventDuties)}</dd>
        </div>
      </dl>
    </div>
  );
};

DutyStatusDetailsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DutyStatusDetailsReview;
