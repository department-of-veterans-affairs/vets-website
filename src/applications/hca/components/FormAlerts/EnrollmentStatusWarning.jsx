import React from 'react';
import PropTypes from 'prop-types';

import {
  getWarningHeadline,
  getWarningStatus,
  getWarningExplanation,
} from '../../enrollment-status-helpers';

const EnrollmentStatusWarning = ({
  applicationDate,
  enrollmentDate,
  enrollmentStatus,
  preferredFacility,
}) => (
  <va-alert status="warning">
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

EnrollmentStatusWarning.propTypes = {
  applicationDate: PropTypes.string,
  enrollmentDate: PropTypes.string,
  enrollmentStatus: PropTypes.string,
  preferredFacility: PropTypes.string,
};

export default EnrollmentStatusWarning;
