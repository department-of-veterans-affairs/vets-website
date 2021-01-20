import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import {
  getWarningHeadline,
  getWarningStatus,
  getWarningExplanation,
} from '../enrollment-status-helpers';

function HCAEnrollmentStatusWarning({
  applicationDate,
  enrollmentDate,
  enrollmentStatus,
  preferredFacility,
}) {
  return (
    <AlertBox
      content={
        <div>
          {getWarningHeadline(enrollmentStatus)}
          {getWarningStatus(
            enrollmentStatus,
            applicationDate,
            enrollmentDate,
            preferredFacility,
          )}
          {getWarningExplanation(enrollmentStatus)}
        </div>
      }
      isVisible
      status="warning"
    />
  );
}

export default HCAEnrollmentStatusWarning;
