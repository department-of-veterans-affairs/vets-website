/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';

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
    <va-alert isVisible status="warning">
      <h2 slot="headline">{getWarningHeadline(enrollmentStatus)}</h2>
      {getWarningStatus(
        enrollmentStatus,
        applicationDate,
        enrollmentDate,
        preferredFacility,
      )}
      {getWarningExplanation(enrollmentStatus)}
    </va-alert>
  );
}

export default HCAEnrollmentStatusWarning;
