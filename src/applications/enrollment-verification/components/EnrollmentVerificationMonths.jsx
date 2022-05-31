import React, { useState, useCallback } from 'react';
import { focusElement } from 'platform/utilities/ui';
// import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Pagination } from '@department-of-veterans-affairs/component-library/index';
import EnrollmentVerificationMonth from './EnrollmentVerificationMonth';
import { ENROLLMENT_VERIFICATION_TYPE, STATUS_PROP_TYPE } from '../helpers';

const MONTHS_PER_PAGE = 6;

function EnrollmentVerificationMonths({ enrollmentVerification, status }) {
  // We assume that months come sorted from most recent to oldest.  If
  // that assumption is incorrect, sort here.
  const months = enrollmentVerification.enrollmentVerifications.map(
    (month, index) => {
      return (
        <EnrollmentVerificationMonth
          key={index}
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
  const numPages = Math.ceil(months?.length / MONTHS_PER_PAGE);
  const minMonth = (currentPage - 1) * MONTHS_PER_PAGE;
  const maxMonth = currentPage * MONTHS_PER_PAGE;

  return (
    <>
      <h2>Your monthly enrollment verifications</h2>
      <va-additional-info trigger="What if I notice an error with my enrollment information?">
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
        <p>
          If you notice a mistake, it’s best if you reach out to your SCO soon.
          The sooner VA knows about changes to your enrollment, the less likely
          you are to be overpaid and incur a debt.
        </p>
      </va-additional-info>

      <p>
        Showing {lowerDisplayedRange}-{upperDisplayedRange} of {months?.length}{' '}
        monthly enrollments listed by most recent
      </p>

      {months?.slice(minMonth, maxMonth)}

      <Pagination
        onPageSelect={onPageSelect}
        page={currentPage}
        pages={numPages}
      />
    </>
  );
}

EnrollmentVerificationMonths.propTypes = {
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE.isRequired,
  status: STATUS_PROP_TYPE.isRequired,
};

export default EnrollmentVerificationMonths;
