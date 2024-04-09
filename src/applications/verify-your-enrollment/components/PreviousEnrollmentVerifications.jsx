import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  combineEnrollmentsWithStartMonth,
  getGroupedPreviousEnrollments,
  getSignlePreviousEnrollments,
} from '../helpers';
import { ENROLLMETS_PER_PAGE } from '../constants';

const PreviousEnrollmentVerifications = ({ enrollmentData }) => {
  const [userEnrollmentData, setUserEnrollmentData] = useState([]);
  const [pastAndCurrentAwards, setPastAndCurrentAwards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [subsetStart, setSubsetStart] = useState(0);
  const [subsetEnd, setSubsetEnd] = useState(0);
  const totalEnrollmentCount = Object.keys(
    combineEnrollmentsWithStartMonth(enrollmentData?.['vye::UserInfo']?.awards),
  ).length;

  const getPreviouslyVerified = () => {
    let enrollments = [];
    Object.values(pastAndCurrentAwards).forEach(month => {
      if (month.length > 1) {
        const tempGroupEnrollment = getGroupedPreviousEnrollments(month);
        enrollments.push(tempGroupEnrollment);
      }
      if (month.length === 1) {
        const tempSingleEnrollment = getSignlePreviousEnrollments(month[0]);
        enrollments.push(tempSingleEnrollment);
      }
    });
    // Adjust based on subsetStart and subsetEnd to control the number of elements returned
    enrollments = enrollments.reverse().slice(subsetStart, subsetEnd);

    return enrollments;
  };

  const handlePageChange = pageNumber => {
    setSubsetStart(pageNumber * ENROLLMETS_PER_PAGE - ENROLLMETS_PER_PAGE);
    if (pageNumber * ENROLLMETS_PER_PAGE > totalEnrollmentCount) {
      setSubsetEnd(totalEnrollmentCount);
    } else {
      setSubsetEnd(pageNumber * ENROLLMETS_PER_PAGE);
    }
    setCurrentPage(pageNumber);
  };

  const onPageSelect = useCallback(
    newPage => {
      handlePageChange(newPage);
      focusElement('.focus-element-on-pagination');
    },
    [setCurrentPage],
  );

  useEffect(
    () => {
      setUserEnrollmentData(enrollmentData);
    },
    [enrollmentData],
  );

  useEffect(
    () => {
      if (
        userEnrollmentData?.['vye::UserInfo']?.awards &&
        userEnrollmentData?.['vye::UserInfo']?.verifications
      ) {
        const { awards, verifications } = userEnrollmentData?.['vye::UserInfo'];
        // add all awards data into single array, verified and non-verified
        const allEnrollments = awards.flatMap((award, index) => {
          // check each award that has been verified and add the
          // verified date to the enrollment period being returned
          if (index < verifications.length) {
            const {
              awardIds,
              createdOn,
              PendingVerificationSubmitted,
            } = verifications[index];
            // check if record has been verified
            if (awardIds?.some(id => id === award.id)) {
              const tempData = award;
              let updatedTempData = {};
              if (createdOn) {
                // add key/value when enrollment was verified
                updatedTempData = { ...tempData, verifiedDate: createdOn };
              }
              if (PendingVerificationSubmitted) {
                // add key/value when enrollment was verified
                updatedTempData = {
                  ...tempData,
                  PendingVerificationSubmitted,
                };
              }
              return updatedTempData;
            }
          }
          // add enrollment that has not been verified
          return award;
        });

        // array of all enrollment periods with verifiedDate
        // add to enrollments that have been verified
        // setPastAndCurrentAwards(allEnrollments);
        setPastAndCurrentAwards(
          combineEnrollmentsWithStartMonth(allEnrollments),
        );
      }
    },
    [userEnrollmentData],
  );

  useEffect(
    () => {
      // set how many enrollments to initially show
      // and the page count
      if (totalEnrollmentCount >= ENROLLMETS_PER_PAGE) {
        setSubsetEnd(ENROLLMETS_PER_PAGE);
        setPageCount(Math.ceil(totalEnrollmentCount / ENROLLMETS_PER_PAGE));
        setCurrentPage(1);
      } else {
        setSubsetEnd(totalEnrollmentCount);
        setPageCount(1);
      }
    },
    [totalEnrollmentCount],
  );

  return (
    <div>
      <>
        <h2 className="focus-element-on-pagination">
          Your monthly enrollment verifications
        </h2>
        <va-additional-info
          trigger="What if I notice an error with my enrollment information?"
          class="vads-u-margin-bottom--2"
        >
          <div className="vads-u-font-weight--bold">You should:</div>
          <ul>
            <li className="vads-u-margin--2">
              Work with your School Certifying Official (SCO) to make sure they
              have the correct enrollment information and can update the
              information on file.
            </li>
            <li className="vads-u-margin--2">
              After your information is corrected, verify the corrected
              information.
            </li>
          </ul>
          <p>
            If you notice a mistake, it’s best if you reach out to your SCO
            soon. The sooner VA knows about changes to your enrollment, the less
            likely you are to be overpaid and incur a debt.
          </p>
        </va-additional-info>
      </>
      {totalEnrollmentCount > 0 && (
        <p id="vye-pagination-page-status-text">
          {`Showing ${subsetStart +
            1}-${subsetEnd} of ${totalEnrollmentCount} monthly enrollments listed by most recent`}
        </p>
      )}
      {totalEnrollmentCount > 0 && getPreviouslyVerified()}
      {/* {totalEnrollmentCount > 0 && pastAndCurrentAwards.length > 0 &&
        <EnrollmentCard enrollmentPeriods={pastAndCurrentAwards}/>} */}
      {totalEnrollmentCount === undefined && (
        <p className="vads-u-margin-bottom--6">
          <strong>You currently have no enrollments.</strong>
        </p>
      )}
      {totalEnrollmentCount > ENROLLMETS_PER_PAGE && (
        <VaPagination
          onPageSelect={e => onPageSelect(e.detail.page)}
          page={currentPage}
          pages={pageCount}
          showLastPage
        />
      )}
    </div>
  );
};
PreviousEnrollmentVerifications.propTypes = {
  enrollmentData: PropTypes.object,
};
export default PreviousEnrollmentVerifications;
