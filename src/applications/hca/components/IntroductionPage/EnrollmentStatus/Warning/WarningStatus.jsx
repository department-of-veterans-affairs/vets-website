import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { getMedicalCenterNameByID } from '~/platform/utilities/medical-centers/medical-centers';
import { isValidDateString } from '~/platform/utilities/date';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { selectEnrollmentStatus } from '../../../../utils/selectors/enrollment-status';
import content from '../../../../locales/en/content.json';

const WarningStatus = () => {
  const {
    enrollmentStatus,
    applicationDate,
    enrollmentDate,
    preferredFacility,
  } = useSelector(selectEnrollmentStatus);

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
          <strong>{content['enrollment-alert-application-date-label']}</strong>{' '}
          {moment(applicationDate).format('MMMM D, YYYY')}
        </li>
      )}

      {showEnrolledDetails && (
        <>
          {isValidDateString(enrollmentDate) && (
            <li>
              <strong>{content['enrollment-alert-enrolled-date-label']}</strong>{' '}
              {moment(enrollmentDate).format('MMMM D, YYYY')}
            </li>
          )}

          {!!facilityName && (
            <li>
              <strong>{content['enrollment-alert-facility-label']}</strong>{' '}
              {facilityName}
            </li>
          )}
        </>
      )}
    </ul>
  ) : null;
};

export default WarningStatus;
