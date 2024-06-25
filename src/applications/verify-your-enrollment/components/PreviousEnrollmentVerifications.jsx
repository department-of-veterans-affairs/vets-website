import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useSelector } from 'react-redux';
import {
  combineEnrollmentsWithStartMonth,
  getGroupedPreviousEnrollments,
  getSignlePreviousEnrollments,
} from '../helpers';
import { ENROLLMETS_PER_PAGE } from '../constants';
import { EnrollmentStatus } from './EnrollmentStatus';

const PreviousEnrollmentVerifications = ({ enrollmentData }) => {
  const [userEnrollmentData, setUserEnrollmentData] = useState([]);
  const [pastAndCurrentAwards, setPastAndCurrentAwards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [subsetStart, setSubsetStart] = useState(0);
  const [subsetEnd, setSubsetEnd] = useState(0);
  const response = useSelector(state => state.personalInfo);
  const totalEnrollmentVerificationsCount = Object.keys(
    combineEnrollmentsWithStartMonth(enrollmentData?.verifications ?? {}),
  ).length;

  const totalEnrollmentPendingVerificationsCount = Object.keys(
    combineEnrollmentsWithStartMonth(
      enrollmentData?.pendingVerifications ?? {},
    ),
  ).length;
  // get count of verified and unverified enrollments (Grouped by start month)
  const totalEnrollmentCount =
    totalEnrollmentPendingVerificationsCount +
    totalEnrollmentVerificationsCount;

  const sortDatesByMonthYear = array => {
    // Helper function to convert "Month YYYY" or "Date unavailable" to a Date object
    function parseDate(dateStr) {
      if (dateStr === 'Date unavailable') {
        // Return a date far in the past to ensure it sorts last
        return new Date(0); // January 1, 1970, or can use a specific older date to be explicit
      }
      const [month, year] = dateStr.split(' ');
      return new Date(`${month} 1, ${year}`);
    }

    // Sorting the array of objects in descending order based on date keys
    array.sort((a, b) => {
      const keyA = Object.keys(a)[0];
      const keyB = Object.keys(b)[0];
      const dateA = parseDate(keyA);
      const dateB = parseDate(keyB);
      return dateB - dateA; // descending sorting | ascending would be dateA - dateB
    });

    // Extracting and returning the React components from the sorted array of objects
    return array.map(obj => Object.values(obj)[0]);
  };

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
    const tempEnrollmentArray = [];
    /*
     enrollments is an array of react components.
     we want to go through each element in the enrollments array
     and find the month/year each element is associated with.
     once we have this, we can sort the array based on month year with
     the latest date on top.
    */
    enrollments?.forEach(enrollment => {
      const topLevelEnrollment = enrollment?.props?.children;
      const isAnArray = Array.isArray(topLevelEnrollment);

      if (!isAnArray) {
        const objectChildProps =
          topLevelEnrollment.props?.children[0]?.props?.children;
        const objectChildPropsIsArray = Array.isArray(objectChildProps);
        if (!objectChildPropsIsArray) {
          tempEnrollmentArray.push({
            [objectChildProps]: enrollment,
          });
        }
        if (objectChildPropsIsArray) {
          tempEnrollmentArray.push({
            [objectChildProps[0].props.children]: enrollment,
          });
        }
      }

      if (isAnArray) {
        // find the first object within the array that is not undefined and is not null
        const firstNotUndefined = topLevelEnrollment.find(
          el => el !== undefined && el !== null && el !== false,
        );
        const firstChildProps =
          firstNotUndefined?.props?.children[0]?.props?.children;
        const firstChildIsArray = Array.isArray(firstChildProps);

        if (firstChildIsArray) {
          tempEnrollmentArray.push({
            [firstChildProps[0].props?.children]: enrollment,
          });
        }

        if (!firstChildIsArray) {
          const secondChildProps =
            firstNotUndefined?.props?.children[0]?.props?.children;
          const secondChildPropsIsArray = Array.isArray(secondChildProps);
          if (!secondChildPropsIsArray) {
            tempEnrollmentArray.push({
              [firstNotUndefined?.props?.children[0]?.props
                ?.children]: enrollment,
            });
          }
        }
      }
    });

    if (tempEnrollmentArray.length > 0) {
      const sortedEnrollments = sortDatesByMonthYear(tempEnrollmentArray);
      enrollments = sortedEnrollments;
    }

    // Adjust based on subsetStart and subsetEnd to control the number of elements returned

    enrollments = enrollments.slice(subsetStart, subsetEnd);
    return enrollments;
  };

  const handlePageChange = useCallback(
    pageNumber => {
      setSubsetStart(pageNumber * ENROLLMETS_PER_PAGE - ENROLLMETS_PER_PAGE);
      if (pageNumber * ENROLLMETS_PER_PAGE > totalEnrollmentCount) {
        setSubsetEnd(totalEnrollmentCount);
      } else {
        setSubsetEnd(pageNumber * ENROLLMETS_PER_PAGE);
      }
      setCurrentPage(pageNumber);
    },
    [totalEnrollmentCount],
  );

  const onPageSelect = useCallback(
    newPage => {
      handlePageChange(newPage);
      focusElement('.focus-element-on-pagination');
    },
    [handlePageChange],
  );

  useEffect(
    () => {
      setUserEnrollmentData(enrollmentData);
    },
    [enrollmentData],
  );

  useEffect(
    () => {
      const allEnrollments = [];
      if (userEnrollmentData?.pendingVerifications?.length > 0) {
        const { pendingVerifications } = userEnrollmentData;
        pendingVerifications.forEach(pendingAward => {
          allEnrollments.push(pendingAward);
        });
      }
      if (userEnrollmentData?.verifications?.length > 0) {
        const { verifications } = userEnrollmentData;
        verifications.forEach(award => {
          allEnrollments.push(award);
        });
      }

      setPastAndCurrentAwards(combineEnrollmentsWithStartMonth(allEnrollments));
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
        <h2>Your monthly enrollment verifications</h2>
        <p>
          Verifications are processed on the business day after submission.
          Payment is projected to be processed within 4 to 6 business days.
        </p>
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
        <EnrollmentStatus
          start={subsetStart + 1}
          end={subsetEnd}
          total={totalEnrollmentCount}
        />
      )}
      {totalEnrollmentCount === 0 && (
        <EnrollmentStatus
          start={subsetStart}
          end={subsetEnd}
          total={totalEnrollmentCount}
          dontHaveEnrollment={response?.error?.error === 'Forbidden'}
        />
      )}
      {totalEnrollmentCount > 0 && getPreviouslyVerified()}
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
