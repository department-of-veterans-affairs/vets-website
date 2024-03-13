import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { isValidDateString } from 'platform/utilities/date';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';

const WarningStatus = props => {
  const {
    enrollmentStatus,
    applicationDate,
    enrollmentDate,
    preferredFacility,
  } = props;

  // Derive medical facility name from facility ID
  const facilityName = getMedicalCenterNameByID(preferredFacility);

  // Declare conditions for content render
  const hasNullStatus = new Set([
    HCA_ENROLLMENT_STATUSES.deceased,
    HCA_ENROLLMENT_STATUSES.nonMilitary,
  ]).has(enrollmentStatus);

  const hasValueToRender = [
    isValidDateString(applicationDate),
    isValidDateString(enrollmentDate),
    facilityName,
  ].some(v => !!v);

  const showEnrolledDetails =
    enrollmentStatus === HCA_ENROLLMENT_STATUSES.enrolled;

  // Render based on enrollment status
  return hasValueToRender && !hasNullStatus ? (
    <ul className="hca-list-style-none">
      {isValidDateString(applicationDate) && (
        <li>
          <strong>You applied on:</strong>{' '}
          {moment(applicationDate).format('MMMM D, YYYY')}
        </li>
      )}

      {showEnrolledDetails && (
        <>
          {isValidDateString(enrollmentDate) && (
            <li>
              <strong>We enrolled you on:</strong>{' '}
              {moment(enrollmentDate).format('MMMM D, YYYY')}
            </li>
          )}

          {!!facilityName && (
            <li>
              <strong>Your preferred VA medical center is:</strong>{' '}
              {facilityName}
            </li>
          )}
        </>
      )}
    </ul>
  ) : null;
};

WarningStatus.propTypes = {
  applicationDate: PropTypes.string,
  enrollmentDate: PropTypes.string,
  enrollmentStatus: PropTypes.string,
  preferredFacility: PropTypes.string,
};

export default WarningStatus;
