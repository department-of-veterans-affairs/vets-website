import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { HCA_ENROLLMENT_STATUSES } from 'applications/hca/constants';
import {
  getAlertContent,
  getAlertStatusHeadline,
  getAlertStatusInfo,
  getAlertType,
} from 'applications/hca/enrollment-status-helpers';
import DashboardAlert from './DashboardAlert';

const HCAStatusAlert = ({ applicationDate, enrollmentStatus, onRemove }) => {
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false);

  const showConfirmation = () => {
    setIsShowingConfirmation(true);
  };

  const hideConfirmation = () => {
    setIsShowingConfirmation(false);
  };

  if (isShowingConfirmation) {
    return (
      <AlertBox status="warning">
        <h3
          className="usa-alert-heading"
          tabIndex="-1"
          ref={el => el && el.focus()}
        >
          Are you sure you want to permanently remove this notification?
        </h3>
        <p>
          Please confirm that you want to remove this notification from your{' '}
          <strong>My VA</strong> dashboard. Removing it won’t affect the status
          of your health care application in any way. But once you remove the
          notification, you can’t add it back again.
        </p>
        <button
          className="usa-button-primary vads-u-margin-y--0"
          aria-label="Remove the notification of my health care application status"
          onClick={onRemove}
        >
          Remove the notification
        </button>
        <button
          className="usa-button-secondary vads-u-margin-y--0"
          aria-label="Cancel the removal of my the health care application status notification"
          onClick={hideConfirmation}
        >
          Cancel
        </button>
      </AlertBox>
    );
  }

  return (
    <DashboardAlert
      id="hca-status"
      status={getAlertType(enrollmentStatus)}
      headline="Application for health care"
      subheadline="FORM 10-10EZ"
      statusHeadline={getAlertStatusHeadline(enrollmentStatus)}
      statusInfo={getAlertStatusInfo(enrollmentStatus)}
      content={getAlertContent(
        enrollmentStatus,
        applicationDate,
        showConfirmation,
      )}
    />
  );
};

export default HCAStatusAlert;

HCAStatusAlert.propTypes = {
  applicationDate: PropTypes.string.isRequired,
  enrollmentStatus: PropTypes.oneOf(Object.values(HCA_ENROLLMENT_STATUSES))
    .isRequired,
  onRemove: PropTypes.func.isRequired,
};
