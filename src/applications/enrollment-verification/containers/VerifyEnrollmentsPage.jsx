import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
import {
  REVIEW_ENROLLMENTS_RELATIVE_URL,
  REVIEW_ENROLLMENTS_URL,
} from '../constants';
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
  const [continueClicked, setContinueClicked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthInformationCorrect, setMonthInformationCorrect] = useState();
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        // history.push('/');
      }

      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [getVerificationStatus, hasCheckedKeepAlive, loggedIn, verificationStatus],
  );

  const unverifiedMonths =
    verificationStatus?.months &&
    verificationStatus?.months.filter(m => !m.verified).reverse();
  const month = unverifiedMonths && unverifiedMonths[currentMonth];
  const informationIncorrectMonth = unverifiedMonths?.find(
    m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  );

  if (editMonthVerification && verificationStatus?.months) {
    setCurrentMonth(editMonthVerification);
  }

  const editMonth = useCallback(
    m => {
      const cm = unverifiedMonths.findIndex(um => um.month === m.month);
      setEditing(true);
      setCurrentMonth(cm);
      setMonthInformationCorrect(unverifiedMonths[cm].verificationStatus);
    },
    [unverifiedMonths],
  );

  const onEditMonth = useCallback(
    m => {
      editMonth(m);
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
        payload: verificationStatus?.months.map(m => {
          return {
            ...m,
            verificationStatus: undefined,
          };
        }),
      });
    },
    [dispatch, verificationStatus?.months],
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
        payload: verificationStatus?.months.map(m => {
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

  const onFinishVerifyingLater = useCallback(
    event => {
      event.preventDefault();
      clearVerificationStatuses();
      history.push(REVIEW_ENROLLMENTS_RELATIVE_URL);
    },
    [clearVerificationStatuses, history],
  );

  if (!verificationStatus || !unverifiedMonths) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

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

        <a
          className="ev-finish-later vads-u-margin-top--4"
          href={REVIEW_ENROLLMENTS_URL}
          onClick={onFinishVerifyingLater}
        >
          Finish verifying your enrollments later
        </a>

        <div className="ev-actions vads-u-margin-top--2p5">
          <button
            type="button"
            className="usa-button-secondary vads-u-margin-y--0"
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
            className="usa-button-primary vads-u-margin-y--0"
            id="2-continueButton"
            onClick={onSubmit}
          >
            Submit verification
          </button>
        </div>
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
        class="vads-u-margin-top--2"
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

      <a
        className="ev-finish-later vads-u-margin-top--4"
        href={REVIEW_ENROLLMENTS_URL}
        onClick={onFinishVerifyingLater}
      >
        Finish verifying your enrollments later
      </a>

      <div className="ev-actions vads-u-margin-top--2p5">
        <button
          type="button"
          className="usa-button-secondary vads-u-margin-y--0"
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
          className="usa-button-primary vads-u-margin-y--0"
          id="2-continueButton"
          onClick={onForwardButtonClick}
        >
          Continue
          <span className="button-icon" aria-hidden="true">
            &nbsp;»
          </span>
        </button>
      </div>
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
