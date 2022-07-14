import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { focusElement } from 'platform/utilities/ui';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  updateEnrollmentVerifications,
  UPDATE_VERIFICATION_STATUS_MONTHS,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
  fetchPost911GiBillEligibility,
} from '../actions';

import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import ReviewEnrollmentVerifications from '../components/ReviewEnrollmentVerifications';
import MonthReviewCard from '../components/MonthReviewCard';
import {
  REVIEW_ENROLLMENTS_RELATIVE_URL,
  VERIFICATION_RESPONSE,
} from '../constants';
import {
  ENROLLMENT_VERIFICATION_TYPE,
  mapEnrollmentVerificationsForSubmission,
} from '../helpers';
import ReviewSkippedAheadAlert from '../components/ReviewSkippedAheadAlert';
import ReviewPausedInfo from '../components/ReviewPausedInfo';
import VerifyEnrollments from '../components/VerifyEnrollments';

export const VerifyEnrollmentsPage = ({
  editMonthVerification,
  enrollmentVerification,
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
  loggedIn,
}) => {
  const [continueClicked, setContinueClicked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthInformationCorrect, setMonthInformationCorrect] = useState();
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        history.push('/');
      }

      if (!enrollmentVerification) {
        getPost911GiBillEligibility();
      }
    },
    [
      enrollmentVerification,
      getPost911GiBillEligibility,
      hasCheckedKeepAlive,
      history,
      loggedIn,
    ],
  );

  useEffect(() => {
    focusElement('h1');
  }, []);

  const unverifiedMonths =
    enrollmentVerification?.enrollmentVerifications &&
    enrollmentVerification?.enrollmentVerifications
      .filter(
        m => m.verificationResponse === VERIFICATION_RESPONSE.NOT_RESPONDED,
      )
      .reverse();
  const month = unverifiedMonths && unverifiedMonths[currentMonth];
  const informationIncorrectMonth = unverifiedMonths?.find(
    m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  );

  if (
    editMonthVerification &&
    enrollmentVerification?.enrollmentVerifications
  ) {
    setCurrentMonth(editMonthVerification);
  }

  const editMonth = useCallback(
    m => {
      const cm = unverifiedMonths.findIndex(
        um =>
          um.certifiedBeginDate === m.certifiedBeginDate &&
          um.certifiedEndDate === m.certifiedEndDate,
      );
      setEditing(true);
      setCurrentMonth(cm);
      setMonthInformationCorrect(unverifiedMonths[cm].verificationStatus);
    },
    [unverifiedMonths],
  );

  const onEditMonth = useCallback(
    m => {
      editMonth(m);
      focusElement('h1');
    },
    [editMonth],
  );

  const updateMonthInformationCorrect = useCallback(
    event => {
      setContinueClicked(false);
      setMonthInformationCorrect(event.value);
    },
    [setContinueClicked, setMonthInformationCorrect],
  );

  const clearVerificationStatuses = useCallback(
    () => {
      dispatch({
        type: UPDATE_VERIFICATION_STATUS_MONTHS,
        payload: enrollmentVerification?.enrollmentVerifications.map(m => {
          return {
            ...m,
            verificationStatus: undefined,
          };
        }),
      });
    },
    [dispatch, enrollmentVerification?.enrollmentVerifications],
  );

  const onBackButtonClick = useCallback(
    () => {
      // Clicking back from the first month
      if (currentMonth === 0) {
        clearVerificationStatuses();
        history.push(REVIEW_ENROLLMENTS_RELATIVE_URL);
        return;
      }

      // Clicking back on the Review page when there is invalid month.
      // In this scenario, we want to go to the invalid month.
      if (informationIncorrectMonth && !editing) {
        editMonth(informationIncorrectMonth);
        return;
      }

      setContinueClicked(false);
      setCurrentMonth(currentMonth - 1);
      setMonthInformationCorrect(
        unverifiedMonths[currentMonth - 1].verificationStatus,
      );
      focusElement('h1');
    },
    [
      clearVerificationStatuses,
      currentMonth,
      editMonth,
      editing,
      history,
      informationIncorrectMonth,
      unverifiedMonths,
    ],
  );

  const onForwardButtonClick = useCallback(
    () => {
      if (!enrollmentVerification) {
        return;
      }

      if (!monthInformationCorrect) {
        if (!continueClicked) {
          setContinueClicked(true);
        }

        return;
      }

      setCurrentMonth(currentMonth + 1);
      setMonthInformationCorrect(
        currentMonth < unverifiedMonths.length - 1
          ? unverifiedMonths[currentMonth + 1].verificationStatus
          : undefined,
      );

      if (
        editing &&
        (monthInformationCorrect === VERIFICATION_STATUS_INCORRECT ||
          currentMonth === unverifiedMonths.length - 1)
      ) {
        setEditing(false);
      }

      dispatch({
        type: UPDATE_VERIFICATION_STATUS_MONTHS,
        payload: enrollmentVerification?.enrollmentVerifications.map(m => {
          if (
            m.certifiedBeginDate ===
              unverifiedMonths[currentMonth].certifiedBeginDate &&
            m.certifiedEndDate ===
              unverifiedMonths[currentMonth].certifiedEndDate
          ) {
            return {
              ...m,
              verificationStatus: monthInformationCorrect,
            };
          }

          // If we're editing and a month is marked as having incorrect
          // information, clear the verification status of the
          // following months.
          if (
            m.certifiedEndDate >
              unverifiedMonths[currentMonth].certifiedEndDate &&
            monthInformationCorrect === VERIFICATION_STATUS_INCORRECT
          ) {
            return {
              ...m,
              verificationStatus: undefined,
            };
          }

          return m;
        }),
      });
      focusElement('h1');
    },
    [
      continueClicked,
      currentMonth,
      dispatch,
      editing,
      monthInformationCorrect,
      unverifiedMonths,
      enrollmentVerification,
    ],
  );

  const onSubmit = useCallback(
    () => {
      updateEnrollmentVerifications(
        mapEnrollmentVerificationsForSubmission(enrollmentVerification),
      );
    },
    [enrollmentVerification],
  );

  const onFinishVerifyingLater = useCallback(
    event => {
      event.preventDefault();
      clearVerificationStatuses();
      history.push(REVIEW_ENROLLMENTS_RELATIVE_URL);
    },
    [clearVerificationStatuses, history],
  );

  if (!enrollmentVerification || !unverifiedMonths) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  if (
    !editing &&
    (informationIncorrectMonth || currentMonth === unverifiedMonths.length)
  ) {
    return (
      <VerifyEnrollments
        currentProgressBarSegment={unverifiedMonths.length + 1}
        forwardButtonText="Submit verification"
        onBackButtonClick={onBackButtonClick}
        onFinishVerifyingLater={onFinishVerifyingLater}
        onForwardButtonClick={onSubmit}
        progressTitlePostfix="Review verifications"
        totalProgressBarSegments={unverifiedMonths.length + 1}
      >
        {informationIncorrectMonth &&
        currentMonth !== unverifiedMonths.length ? (
          <ReviewSkippedAheadAlert
            incorrectMonth={informationIncorrectMonth.verificationMonth}
          />
        ) : (
          <></>
        )}
        {informationIncorrectMonth ? (
          <ReviewPausedInfo onFinishVerifyingLater={onFinishVerifyingLater} />
        ) : (
          <></>
        )}

        <ReviewEnrollmentVerifications
          months={unverifiedMonths}
          informationIncorrectMonth={informationIncorrectMonth}
          onEditMonth={onEditMonth}
        />
      </VerifyEnrollments>
    );
  }

  return (
    <VerifyEnrollments
      currentProgressBarSegment={currentMonth + 1}
      onBackButtonClick={onBackButtonClick}
      onFinishVerifyingLater={onFinishVerifyingLater}
      onForwardButtonClick={onForwardButtonClick}
      progressTitlePostfix={`Verify ${month.verificationMonth}`}
      totalProgressBarSegments={unverifiedMonths.length + 1}
    >
      <MonthReviewCard month={month} />

      <RadioButtons
        errorMessage={continueClicked ? 'Please select an option' : ''}
        label="To the best of your knowledge, is this enrollment information correct?"
        onValueChange={updateMonthInformationCorrect}
        options={[
          {
            value: VERIFICATION_STATUS_CORRECT,
            label: 'Yes, this information is correct',
          },
          {
            value: VERIFICATION_STATUS_INCORRECT,
            label: 'No, this information isn’t correct',
          },
        ]}
        required
        value={{ value: monthInformationCorrect }}
      />

      <va-alert
        class="vads-u-margin-top--2"
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        If you select “<em>No, this information isn’t correct</em>”{' '}
        <strong>
          we will pause your monthly payment until your information is updated
        </strong>
        . Work with your School Certifying Official (SCO) to ensure your
        enrollment information is updated with VA.
      </va-alert>
    </VerifyEnrollments>
  );
};

VerifyEnrollmentsPage.propTypes = {
  editMonthVerification: PropTypes.number,
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE,
  getPost911GiBillEligibility: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  loggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  editMonthVerification: state?.data?.editMonthVerification,
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  enrollmentVerification: state?.data?.enrollmentVerification,
});

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsPage);
