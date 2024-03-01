import React from 'react';
import PropTypes from 'prop-types';

import WarningHeadline from './WarningHeadline';
import WarningStatus from './WarningStatus';
import WarningExplanation from './WarningExplanation';

const EnrollmentStatusWarning = ({
  applicationDate,
  enrollmentDate,
  enrollmentStatus,
  preferredFacility,
}) => (
  <va-alert status="warning" uswds>
    <WarningHeadline enrollmentStatus={enrollmentStatus} />
    <WarningStatus
      enrollmentStatus={enrollmentStatus}
      applicationDate={applicationDate}
      enrollmentDate={enrollmentDate}
      preferredFacility={preferredFacility}
    />
    <WarningExplanation enrollmentStatus={enrollmentStatus} />
  </va-alert>
);

EnrollmentStatusWarning.propTypes = {
  applicationDate: PropTypes.string,
  enrollmentDate: PropTypes.string,
  enrollmentStatus: PropTypes.string,
  preferredFacility: PropTypes.string,
};

export default EnrollmentStatusWarning;
