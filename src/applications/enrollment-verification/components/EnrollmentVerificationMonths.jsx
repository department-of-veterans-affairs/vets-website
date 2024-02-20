import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EnrollmentVerificationMonth from './EnrollmentVerificationMonth';
import { ENROLLMENT_VERIFICATION_TYPE, STATUS_PROP_TYPE } from '../helpers';

const MONTHS_PER_PAGE = 6;

function EnrollmentVerificationMonths({
  enrollmentVerification,
  status,
  showMaintenanceAlert,
}) {
  // We assume that months come sorted from most recent to oldest.  If
  // that assumption is incorrect, sort here.
  const months = enrollmentVerification?.enrollmentVerifications?.map(
    (month, index) => {
      return (
        <EnrollmentVerificationMonth
          key={index}
          lastCertifiedThroughDate={
            enrollmentVerification.lastCertifiedThroughDate
          }
          month={month}
          status={status}
        />
      );
    },
  );

  const [currentPage, setCurrentPage] = useState(1);
  const onPageSelect = useCallback(
    newPage => {
      setCurrentPage(newPage);
      focusElement('h2');
    },
    [setCurrentPage],
  );

  const lowerDisplayedRange = MONTHS_PER_PAGE * (currentPage - 1) + 1;
  const upperDisplayedRange = Math.min(
    currentPage * MONTHS_PER_PAGE,
    months?.length,
  );
  const showingPages = months?.length
    ? `${lowerDisplayedRange} - ${upperDisplayedRange}`
    : '0';
  const numPages = Math.ceil(months?.length / MONTHS_PER_PAGE);
  const minMonth = (currentPage - 1) * MONTHS_PER_PAGE;
  const maxMonth = currentPage * MONTHS_PER_PAGE;

  return (
    <>
      <h2>Your monthly enrollment verifications</h2>
      {!showMaintenanceAlert && (
        <va-additional-info trigger="What if I notice an error with my enrollment information?">
          <p className="vads-u-padding-bottom--2">
            <strong>You should:</strong>
          </p>
          <ul>
            <li>
              Work with your School Certifying Official (SCO) to make sure they
              have the correct enrollment information and can update the
              information on file.
            </li>
            <li>
              After your information is corrected, verify the corrected
              information.
            </li>
          </ul>
          <p className="vads-u-padding-top--2">
            If you notice a mistake, it’s best if you reach out to your SCO
            soon. The sooner VA knows about changes to your enrollment, the less
            likely you are to be overpaid and incur a debt.
          </p>
        </va-additional-info>
      )}
      {!showMaintenanceAlert && (
        <p>
          Showing {showingPages} of {months?.length || '0'} monthly enrollments
          listed by most recent
        </p>
      )}
      {months?.slice(minMonth, maxMonth)}
      {!showMaintenanceAlert &&
        !months?.length && (
          <p className="vads-u-margin-bottom--6">
            <strong>You currently have no enrollments.</strong>
          </p>
        )}
      {months?.length > 0 && (
        <VaPagination
          onPageSelect={e => onPageSelect(e.detail.page)}
          page={currentPage}
          pages={numPages}
        />
      )}
    </>
  );
}

EnrollmentVerificationMonths.propTypes = {
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE.isRequired,
  status: STATUS_PROP_TYPE.isRequired,
  showMaintenanceAlert: PropTypes.bool,
};

export default EnrollmentVerificationMonths;
