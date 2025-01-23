import React from 'react';
import { useSelector } from 'react-redux';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { isValidDateString } from 'platform/utilities/date';
import { formatDate } from '../../../../utils/helpers';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { selectEnrollmentStatus } from '../../../../utils/selectors';
import content from '../../../../locales/en/content.json';

const WarningStatus = () => {
  const {
    statusCode,
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
  ]).has(statusCode);

  const hasValueToRender = [
    isValidDateString(applicationDate),
    isValidDateString(enrollmentDate),
    facilityName,
  ].some(v => !!v);

  const showEnrolledDetails = statusCode === HCA_ENROLLMENT_STATUSES.enrolled;

  // Render based on enrollment status
  return hasValueToRender && !hasNullStatus ? (
    <ul className="hca-list-style-none">
      {isValidDateString(applicationDate) && (
        <li>
          <strong>{content['enrollment-alert-application-date-label']}</strong>{' '}
          {formatDate(applicationDate, 'MMMM d, yyyy')}
        </li>
      )}

      {showEnrolledDetails && (
        <>
          {isValidDateString(enrollmentDate) && (
            <li>
              <strong>{content['enrollment-alert-enrolled-date-label']}</strong>{' '}
              {formatDate(enrollmentDate, 'MMMM d, yyyy')}
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
