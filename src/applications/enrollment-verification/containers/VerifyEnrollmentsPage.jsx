import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import {
  postEnrollmentVerifications,
  UPDATE_VERIFICATION_STATUS_MONTHS,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
  fetchPost911GiBillEligibility,
  UPDATE_VERIFICATION_STATUS_SUCCESS,
} from '../actions';

import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import ReviewEnrollmentVerifications from '../components/ReviewEnrollmentVerifications';
import MonthReviewCard from '../components/MonthReviewCard';
import {
  REVIEW_ENROLLMENTS_RELATIVE_URL,
  STATIC_CONTENT_ENROLLMENT_URL,
  VERIFY_ENROLLMENTS_ERROR_RELATIVE_URL,
} from '../constants';
import {
  ENROLLMENT_VERIFICATION_TYPE,
  mapEnrollmentVerificationsForSubmission,
} from '../helpers';
import { getEVData } from '../selectors';

import ReviewPausedInfo from '../components/ReviewPausedInfo';
import VerifyEnrollments from '../components/VerifyEnrollments';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';

export const VerifyEnrollmentsPage = ({
  editMonthVerification,
  enrollmentVerification,
  enrollmentVerificationFetchFailure,
  enrollmentVerificationSubmitted,
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
  isLoggedIn,
  submissionResult,
  updateEnrollmentVerifications,
}) => {
  const [continueClicked, setContinueClicked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthInformationCorrect, setMonthInformationCorrect] = useState();
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (hasCheckedKeepAlive && !isLoggedIn) {
      window.location.href = STATIC_CONTENT_ENROLLMENT_URL;
    }
  }, [hasCheckedKeepAlive, history, isLoggedIn]);

  useEffect(() => {
    if (enrollmentVerificationFetchFailure) {
      history.push(REVIEW_ENROLLMENTS_RELATIVE_URL);
    }
  }, [
    enrollmentVerificationFetchFailure,
    hasCheckedKeepAlive,
    history,
    isLoggedIn,
  ]);

  useEffect(() => {
    if (submissionResult) {
      history.push(
        submissionResult === UPDATE_VERIFICATION_STATUS_SUCCESS
          ? REVIEW_ENROLLMENTS_RELATIVE_URL
          : VERIFY_ENROLLMENTS_ERROR_RELATIVE_URL,
      );
    }
  }, [history, submissionResult]);

  useEffect(() => {
    if (!enrollmentVerification) {
      getPost911GiBillEligibility();
    }
  }, [enrollmentVerification, getPost911GiBillEligibility]);

  useEffect(() => {
    scrollToTop('h1');
  }, []);

  // We recieve enrollments in descending order by date and reverse them
  // after filtering so we can approve the earliest enrollment period
  // first.
  const evs = enrollmentVerification?.enrollmentVerifications;
  const earliestUnverifiedMonthIndex = evs?.findLastIndex(
    ev =>
      ev.certifiedEndDate > enrollmentVerification?.lastCertifiedThroughDate,
  );
  const unverifiedMonths = useMemo(
    () =>
      earliestUnverifiedMonthIndex === -1
        ? []
        : evs?.slice(0, earliestUnverifiedMonthIndex + 1).reverse(),
    [earliestUnverifiedMonthIndex, evs],
  );
  const month = unverifiedMonths?.length && unverifiedMonths[currentMonth];
  const informationIncorrectMonth = unverifiedMonths?.find(
    m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  );

  if (editMonthVerification && evs) {
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
      scrollToTop('h1');
    },
    [editMonth],
  );

  const updateMonthInformationCorrect = useCallback(
    event => {
      setContinueClicked(false);
      setMonthInformationCorrect(event?.detail?.value);
    },
    [setContinueClicked, setMonthInformationCorrect],
  );

  const clearVerificationStatuses = useCallback(() => {
    dispatch({
      type: UPDATE_VERIFICATION_STATUS_MONTHS,
      payload: evs.map(m => {
        return {
          ...m,
          verificationStatus: undefined,
        };
      }),
    });
  }, [dispatch, evs]);

  const onBackButtonClick = useCallback(() => {
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
    scrollToTop('h1');
    focusElement('#react-root h2');
  }, [
    clearVerificationStatuses,
    currentMonth,
    editMonth,
    editing,
    history,
    informationIncorrectMonth,
    unverifiedMonths,
  ]);

  const onForwardButtonClick = useCallback(() => {
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
      payload: evs.map(m => {
        if (
          m.certifiedBeginDate ===
            unverifiedMonths[currentMonth].certifiedBeginDate &&
          m.certifiedEndDate === unverifiedMonths[currentMonth].certifiedEndDate
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
    scrollToTop('h1');
    focusElement('#react-root h2');
  }, [
    continueClicked,
    currentMonth,
    dispatch,
    editing,
    enrollmentVerification,
    evs,
    monthInformationCorrect,
    unverifiedMonths,
  ]);

  const onSubmit = useCallback(() => {
    updateEnrollmentVerifications(
      mapEnrollmentVerificationsForSubmission(enrollmentVerification),
    );
  }, [enrollmentVerification, updateEnrollmentVerifications]);

  const onFinishVerifyingLater = useCallback(
    event => {
      event.preventDefault();
      clearVerificationStatuses();
      history.push(REVIEW_ENROLLMENTS_RELATIVE_URL);
    },
    [clearVerificationStatuses, history],
  );

  if (!isLoggedIn && !hasCheckedKeepAlive) {
    return <EnrollmentVerificationLoadingIndicator />;
  }
  if (enrollmentVerificationSubmitted) {
    return (
      <EnrollmentVerificationPageWrapper>
        <h1>Verify your enrollments</h1>

        <EnrollmentVerificationLoadingIndicator message="Loading your result..." />
      </EnrollmentVerificationPageWrapper>
    );
  }
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
        showPrivacyAgreement
        totalProgressBarSegments={unverifiedMonths.length + 1}
      >
        {informationIncorrectMonth ? (
          <ReviewPausedInfo
            skippedAheadIncorrectMonth={
              currentMonth !== unverifiedMonths.length
                ? informationIncorrectMonth.verificationMonth
                : null
            }
            onFinishVerifyingLater={onFinishVerifyingLater}
          />
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

      <VaRadio
        aria-describedby="information-incorrect-warning"
        class="vads-u-margin-y--4"
        error={continueClicked ? 'Please select an option' : ''}
        label="To the best of your knowledge, is this enrollment information correct?"
        onVaValueChange={updateMonthInformationCorrect}
        required
      >
        <va-radio-option
          aria-describedby="information-incorrect-warning"
          checked={monthInformationCorrect === VERIFICATION_STATUS_CORRECT}
          class="vads-u-margin-y--2"
          label="Yes, this information is correct"
          name={VERIFICATION_STATUS_CORRECT}
          value={VERIFICATION_STATUS_CORRECT}
        />
        <va-radio-option
          aria-describedby="information-incorrect-warning"
          checked={monthInformationCorrect === VERIFICATION_STATUS_INCORRECT}
          class="vads-u-margin-y--2"
          description="If you select “No, this information isn’t correct” we will pause your monthly payment until your information is updated. Work with your School Certifying Official (SCO) to ensure your enrollment information is updated with VA."
          label="No, this information isn’t correct"
          name={VERIFICATION_STATUS_INCORRECT}
          value={VERIFICATION_STATUS_INCORRECT}
        />
      </VaRadio>
    </VerifyEnrollments>
  );
};

VerifyEnrollmentsPage.propTypes = {
  editMonthVerification: PropTypes.number,
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE,
  enrollmentVerificationFetchFailure: PropTypes.bool,
  enrollmentVerificationSubmitted: PropTypes.bool,
  getPost911GiBillEligibility: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  loggedIn: PropTypes.bool,
  submissionResult: PropTypes.string,
  updateEnrollmentVerifications: PropTypes.func,
};

const mapStateToProps = state => getEVData(state);

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
  updateEnrollmentVerifications: postEnrollmentVerifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsPage);
