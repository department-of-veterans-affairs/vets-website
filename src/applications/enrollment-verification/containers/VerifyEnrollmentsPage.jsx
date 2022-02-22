import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  fetchVerificationStatus,
  updateVerificationStatus,
  UPDATE_VERIFICATION_STATUS_MONTHS,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';

import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import ReviewEnrollmentVerifications from '../components/ReviewEnrollmentVerifications';
import MonthReviewCard from '../components/MonthReviewCard';
import { BASE_URL, REVIEW_ENROLLMENTS_URL } from '../constants';
import {
  ENROLLMENT_VERIFICATION_TYPE,
  formatReadableMonthYear,
} from '../helpers';
import ReviewSkippedAheadAlert from '../components/ReviewSkippedAheadAlert';
import ReviewPausedInfo from '../components/ReviewPausedInfo';

export const VerifyEnrollmentsPage = ({
  editMonthVerification,
  getVerificationStatus,
  hasCheckedKeepAlive,
  loggedIn,
  verificationStatus,
}) => {
  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        window.location.href = BASE_URL;
      }

      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [getVerificationStatus, hasCheckedKeepAlive, loggedIn, verificationStatus],
  );

  const [continueClicked, setContinueClicked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthInformationCorrect, setMonthInformationCorrect] = useState();
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  const unverifiedMonths =
    verificationStatus?.months &&
    verificationStatus?.months.filter(m => !m.verified).reverse();
  const month = unverifiedMonths && unverifiedMonths[currentMonth];

  if (editMonthVerification && verificationStatus?.months) {
    setCurrentMonth(editMonthVerification);
  }

  const onEditMonth = useCallback(
    m => {
      const cm = unverifiedMonths.findIndex(um => um.month === m.month);
      setEditing(true);
      setCurrentMonth(cm);
      setMonthInformationCorrect(unverifiedMonths[cm].verificationStatus);
      return false;
    },
    [unverifiedMonths, setCurrentMonth, setEditing],
  );

  const updateMonthInformationCorrect = useCallback(
    event => {
      setContinueClicked(false);
      setMonthInformationCorrect(event.value);
    },
    [setContinueClicked, setMonthInformationCorrect],
  );

  const onBackButtonClick = useCallback(
    () => {
      if (currentMonth === 0) {
        window.location.href = REVIEW_ENROLLMENTS_URL;
      }

      setContinueClicked(false);
      setCurrentMonth(currentMonth - 1);
      setMonthInformationCorrect(
        unverifiedMonths[currentMonth - 1].verificationStatus,
      );
    },
    [currentMonth, unverifiedMonths],
  );

  const onForwardButtonClick = useCallback(
    () => {
      if (!verificationStatus) {
        return;
      }

      if (!monthInformationCorrect) {
        if (!continueClicked) {
          setContinueClicked(true);
        }

        return;
      }

      setCurrentMonth(currentMonth + 1);
      setMonthInformationCorrect(undefined);

      if (
        editing &&
        (monthInformationCorrect === VERIFICATION_STATUS_INCORRECT ||
          currentMonth === unverifiedMonths.length - 1)
      ) {
        setEditing(false);
      }

      dispatch({
        type: UPDATE_VERIFICATION_STATUS_MONTHS,
        payload: verificationStatus.months.map(m => {
          if (m.month === unverifiedMonths[currentMonth].month) {
            return {
              ...m,
              verificationStatus: monthInformationCorrect,
            };
          }

          // If we're editing and a month is marked as having incorrect
          // information, clear the verification status of the
          // following months.
          if (
            m.month > unverifiedMonths[currentMonth].month &&
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
    },
    [
      continueClicked,
      currentMonth,
      dispatch,
      editing,
      monthInformationCorrect,
      unverifiedMonths,
      verificationStatus,
    ],
  );

  const onSubmit = useCallback(
    () => {
      updateVerificationStatus(verificationStatus);
    },
    [verificationStatus],
  );

  if (!verificationStatus || !unverifiedMonths) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  const informationIncorrectMonth = unverifiedMonths.find(
    m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  );

  if (
    !editing &&
    (informationIncorrectMonth || currentMonth === unverifiedMonths.length)
  ) {
    return (
      <EnrollmentVerificationPageWrapper>
        <h1>Verify your enrollments</h1>

        <va-segmented-progress-bar
          current={unverifiedMonths.length + 1}
          total={unverifiedMonths.length + 1}
        />

        <h2 className="vads-u-font-size--h4 vads-u-margin-top--4 vads-u-margin-bottom--4">
          Step {unverifiedMonths.length + 1} of {unverifiedMonths.length + 1}:
          Review verifications
        </h2>

        {informationIncorrectMonth &&
        currentMonth !== unverifiedMonths.length ? (
          <ReviewSkippedAheadAlert />
        ) : (
          <></>
        )}
        {informationIncorrectMonth ? <ReviewPausedInfo /> : <></>}

        <ReviewEnrollmentVerifications
          months={unverifiedMonths}
          informationIncorrectMonth={informationIncorrectMonth}
          onEditMonth={onEditMonth}
        />

        <button
          type="button"
          className="usa-button-secondary vads-u-margin-top--4"
          id="1-continueButton"
          onClick={onBackButtonClick}
        >
          <span className="button-icon" aria-hidden="true">
            «&nbsp;
          </span>
          Back
        </button>
        <button
          type="submit"
          className="usa-button-primary vads-u-margin-top--4"
          id="2-continueButton"
          onClick={onSubmit}
        >
          Submit verification
        </button>
      </EnrollmentVerificationPageWrapper>
    );
  }

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-segmented-progress-bar
        current={currentMonth + 1}
        total={unverifiedMonths.length + 1}
      />

      <h2 className="vads-u-font-size--h4 vads-u-margin-top--4 vads-u-margin-bottom--4">
        Step {currentMonth + 1} of {unverifiedMonths.length + 1}: Verify{' '}
        {formatReadableMonthYear(month.month)}
      </h2>

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
            label: 'No, this information is incorrect',
          },
        ]}
        required
        value={{ value: monthInformationCorrect }}
      />

      <va-alert
        class="vads-u-margin-top--2 vads-u-margin-bottom--4"
        close-btn-aria-label="Close notification"
        status="info"
        visible
      >
        If you select "<em>No, this information is incorrect</em>"{' '}
        <strong>
          we will pause your monthly housing payment until your information is
          updated
        </strong>
        . Work with your School Certifying Official (SCO) to ensure your
        enrollment information is updated with VA.
      </va-alert>

      <button
        type="button"
        className="usa-button-secondary"
        id="1-continueButton"
        onClick={onBackButtonClick}
      >
        <span className="button-icon" aria-hidden="true">
          «&nbsp;
        </span>
        Back
      </button>
      <button
        type="submit"
        className="usa-button-primary"
        id="2-continueButton"
        onClick={onForwardButtonClick}
      >
        Continue
        <span className="button-icon" aria-hidden="true">
          &nbsp;»
        </span>
      </button>
    </EnrollmentVerificationPageWrapper>
  );
};

const mapStateToProps = state => ({
  editMonthVerification: state?.data?.editMonthVerification,
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  verificationStatus: state?.data?.verificationStatus,
});

const mapDispatchToProps = {
  getVerificationStatus: fetchVerificationStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsPage);

VerifyEnrollmentsPage.propTypes = {
  editMonthVerification: PropTypes.number,
  getVerificationStatus: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  loggedIn: PropTypes.bool,
  verificationStatus: ENROLLMENT_VERIFICATION_TYPE,
};
