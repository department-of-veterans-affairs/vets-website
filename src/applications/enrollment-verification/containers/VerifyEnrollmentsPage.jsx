/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  fetchVerificationStatus,
  UPDATE_VERIFICATION_STATUS_MONTHS,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';

import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import ReviewEnrollmentVerifications from '../components/ReviewEnrollmentVerifications';
import MonthReviewCard from '../components/MonthReviewCard';
import { REVIEW_ENROLLMENTS_URL } from '../constants';
import { formatReadableMonthYear } from '../helpers';

export const VerifyEnrollmentsPage = ({
  getVerificationStatus,
  hasCheckedKeepAlive,
  loggedIn,
  verificationStatus,
}) => {
  // const { verificationStatus } = props;

  // if (unverifiedMonths) {
  //   const editMonthIndex = editMonthVerification
  //     ? unverifiedMonths.findIndex(
  //         m => m.month === editMonthVerification.month,
  //       )
  //     : -1;

  //   month =
  //     editMonthIndex > -1
  //       ? unverifiedMonths[editMonthIndex]
  //       : unverifiedMonths[currentMonth];
  // } else if (verificationStatus?.months?.length && !unverifiedMonths) {
  // let firstUnverifiedMonthIndex;
  // let _unverifiedMonths;
  // let _informationIncorrectMonth;
  // if (verificationStatus?.months?.length) {
  //   _unverifiedMonths = verificationStatus.months
  //     .filter(m => !m.verified)
  //     .reverse();

  //   _informationIncorrectMonth = _unverifiedMonths.find(
  //     m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  //   );

  //   if (!_informationIncorrectMonth) {
  //     firstUnverifiedMonthIndex = _unverifiedMonths.findIndex(
  //       m => !m.verified,
  //     );
  //   }

  //   // this.setState({
  //   //   // currentMonth: firstUnverifiedMonthIndex || currentMonth,
  //   //   // unverifiedMonths: _unverifiedMonths,
  //   //   // informationIncorrectMonth: _informationIncorrectMonth,
  //   // });
  // }

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        window.location.href = '/enrollment-history/';
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
  const dispatch = useDispatch();

  const unverifiedMonths =
    verificationStatus?.months &&
    verificationStatus?.months.filter(m => !m.verified).reverse();
  const month = unverifiedMonths && unverifiedMonths[currentMonth];

  // TODO
  // if (!unverifiedMonths || !unverifiedMonths.length) {
  // window.location.html = '';
  // }

  function onEditMonth(m) {
    const cm = unverifiedMonths.findIndex(um => um.month === m.month);
    setCurrentMonth(cm);
  }

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

      dispatch({
        type: UPDATE_VERIFICATION_STATUS_MONTHS,
        payload: verificationStatus.months.map(
          m =>
            m.month === unverifiedMonths[currentMonth].month
              ? {
                  ...m,
                  verificationStatus: monthInformationCorrect,
                }
              : m,
        ),
      });

      setCurrentMonth(currentMonth + 1);
      setMonthInformationCorrect(undefined);
    },
    [
      continueClicked,
      currentMonth,
      dispatch,
      monthInformationCorrect,
      verificationStatus,
    ],
  );

  // if (unverifiedMonths) {
  // const editMonthIndex = editMonthVerification
  //   ? unverifiedMonths.findIndex(
  //       m => m.month === editMonthVerification.month,
  //     )
  //   : -1;

  // month =
  //   editMonthIndex > -1
  //     ? unverifiedMonths[editMonthIndex]
  //     : unverifiedMonths[currentMonth];
  // } else if (verificationStatus?.months?.length && !unverifiedMonths) {
  // const _unverifiedMonths = verificationStatus.months
  //   .filter(m => !m.verified)
  //   .reverse();

  // const _informationIncorrectMonth = _unverifiedMonths.find(
  //   m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  // );

  // let firstUnverifiedMonthIndex;
  // if (!_informationIncorrectMonth) {
  //   firstUnverifiedMonthIndex = _unverifiedMonths.findIndex(
  //     m => !m.verified,
  //   );
  //   month = _unverifiedMonths[firstUnverifiedMonthIndex];
  // }

  // this.setState({
  //   // currentMonth: firstUnverifiedMonthIndex || currentMonth,
  //   unverifiedMonths: _unverifiedMonths,
  //   informationIncorrectMonth: _informationIncorrectMonth,
  // });
  // }

  if (!verificationStatus || !unverifiedMonths) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  const informationIncorrectMonth = unverifiedMonths.find(
    m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
  );

  if (informationIncorrectMonth || currentMonth === unverifiedMonths.length) {
    return (
      <EnrollmentVerificationPageWrapper>
        <h1>Verify your enrollments</h1>

        <va-segmented-progress-bar
          current={currentMonth + 1}
          total={unverifiedMonths.length + 1}
        />

        <h2>
          Step {currentMonth + 1} of {unverifiedMonths.length + 1}: Review
          verifications
        </h2>

        <ReviewEnrollmentVerifications
          months={unverifiedMonths}
          informationIncorrectMonth={informationIncorrectMonth}
          onEditMonth={onEditMonth}
        />
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

      <h4>
        Step {currentMonth + 1} of {unverifiedMonths.length + 1}: Verify{' '}
        {formatReadableMonthYear(month.month)}
      </h4>

      {/* <va-alert
        background-only
        close-btn-aria-label="Close notification"
        status="info"
        visible
      >
        We skipped you ahead to the review step because you selected "No, this
        information isn’t correct" for September 2021.
      </va-alert> */}
      {/* 
      <br />

      <va-alert
        background-only
        close-btn-aria-label="Close notification"
        show-icon
        status="warning"
        visible
      >
        <va-additional-info trigger="If you submit this verification, we'll pause your monthly education payments">
          <p>
            If you submit this verification, we will pause your monthly payments
            until your enrollment information is corrected.
          </p>
          <p>
            You can update your enrollment information before you submit your
            verification:
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
        </va-additional-info>
      </va-alert> */}

      <br />

      <MonthReviewCard month={month} />

      <RadioButtons
        errorMessage={continueClicked ? 'Please select an option' : ''}
        label="To the best of your knowledge, is this enrollment information correct?"
        // onKeyDown={function noRefCheck() {}}
        // onMouseDown={function noRefCheck() {}}
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
