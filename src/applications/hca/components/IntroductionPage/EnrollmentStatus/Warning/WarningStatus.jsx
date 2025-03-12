import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { formatDate } from '../../../../utils/helpers';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { selectEnrollmentStatus } from '../../../../utils/selectors';
import content from '../../../../locales/en/content.json';

const NULL_STATUSES = new Set([
  HCA_ENROLLMENT_STATUSES.deceased,
  HCA_ENROLLMENT_STATUSES.nonMilitary,
]);

const WarningStatus = () => {
  const {
    statusCode,
    applicationDate,
    enrollmentDate,
    preferredFacility,
  } = useSelector(selectEnrollmentStatus);

  const facilityName = useMemo(
    () => getMedicalCenterNameByID(preferredFacility),
    [preferredFacility],
  );

  const formattedDates = useMemo(
    () => ({
      applicationDate: formatDate(applicationDate, 'MMMM d, yyyy'),
      enrollmentDate: formatDate(enrollmentDate, 'MMMM d, yyyy'),
    }),
    [applicationDate, enrollmentDate],
  );

  const hasNullStatus = useMemo(() => NULL_STATUSES.has(statusCode), [
    statusCode,
  ]);

  const showEnrolledDetails = statusCode === HCA_ENROLLMENT_STATUSES.enrolled;

  const hasValueToRender = useMemo(
    () =>
      formattedDates.applicationDate ||
      formattedDates.enrollmentDate ||
      facilityName,
    [facilityName, formattedDates],
  );

  if (!hasValueToRender || hasNullStatus) return null;

  return (
    <ul className="hca-list-style-none">
      {formattedDates.applicationDate && (
        <li>
          <strong>{content['enrollment-alert-application-date-label']}</strong>{' '}
          {formattedDates.applicationDate}
        </li>
      )}

      {showEnrolledDetails && (
        <>
          {formattedDates.enrollmentDate && (
            <li>
              <strong>{content['enrollment-alert-enrolled-date-label']}</strong>{' '}
              {formattedDates.enrollmentDate}
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
  );
};

export default WarningStatus;
