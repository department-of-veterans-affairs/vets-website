import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  fetchVerificationStatus,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import EnrollmentVerificationMonthInfo from '../components/EnrollmentVerificationMonthInfo';

export const VerifyEnrollmentsPage = ({
  getVerificationStatus,
  loggedIn,
  verificationStatus,
}) => {
  useEffect(
    () => {
      // TODO Uncomment once ID.me issues are resolved.
      // if (!loggedIn) {
      //   window.location.href = '/enrollment-history/';
      // }

      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [getVerificationStatus, loggedIn, verificationStatus],
  );

  // TODO
  // if (!unverifiedMonths || !unverifiedMonths.length) {
  // window.location.html = '';
  // }

  const [monthInformationCorrect, setMonthInformationCorrect] = useState();
  const [continueClicked, setContinueClicked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [month, setMonth] = useState();
  const [informationIncorrectMonth, setInformationIncorrectMonth] = useState();
  const [unverifiedMonths, setUnverifiedMonths] = useState();

  if (verificationStatus?.months?.length && !unverifiedMonths) {
    const months = verificationStatus.months.reverse();
    setUnverifiedMonths(months.filter(m => !m.verified));
    const _informationIncorrectMonth = months.find(
      m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
    );
    setInformationIncorrectMonth(_informationIncorrectMonth);
    if (!_informationIncorrectMonth) {
      const firstUnverifiedMonthIndex = months.findIndex(m => !m.verified);
      setCurrentMonth(currentMonth);
      setMonth(unverifiedMonths[firstUnverifiedMonthIndex]);
    }
  }

  const updateMonthInformationCorrect = event => {
    setContinueClicked(false);
    setMonthInformationCorrect(event.value);
  };

  const onBackButtonClick = () => {
    if (currentMonth === 0) {
      window.location.href = '/enrollment-history/review-enrollments';
    }
  };

  const onForwardButtonClick = () => {
    if (!monthInformationCorrect) {
      setContinueClicked(true);
      return;
    }

    setUnverifiedMonths(
      unverifiedMonths.map(
        (m, i) =>
          i === currentMonth
            ? {
                ...m,
                verificationStatus: monthInformationCorrect,
              }
            : m,
      ),
    );

    setCurrentMonth(currentMonth + 1);
    setMonthInformationCorrect(undefined);
    if (monthInformationCorrect === VERIFICATION_STATUS_INCORRECT) {
      setInformationIncorrectMonth(month.month);
    }

    // if () {
    //   window.location.href = '/enrollment-history/review-enrollments';
    // }
  };

  if (!verificationStatus || !unverifiedMonths) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  if (informationIncorrectMonth || currentMonth === unverifiedMonths.length) {
    return <>Review Page</>;
  }

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-segmented-progress-bar
        current={currentMonth + 1}
        total={unverifiedMonths.length}
      />

      <h2>
        Step {currentMonth + 1} of {unverifiedMonths.length}: Verify{' '}
        {month.month}
      </h2>

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

      <div className="ev-highlighted-content-container">
        <header className="ev-highlighted-content-container_header">
          <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
            {month.month}
          </h1>
        </header>
        <div className="ev-highlighted-content-container_content">
          <p>
            This is the enrollment information we have on file for you for{' '}
            {month.month}.
          </p>
          <div className="ev-info-block">
            <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
          </div>
        </div>
      </div>

      {/* <va-radio
        error="Please select an option"
        label="To the best of your knowledge, is this enrollment information correct?"
        vaValueChange={event => {
          window.console.log(`${event} FOO radioOptionSelected`);
          setMonthInformationCorrect(event.detail.value);
        }}
        onVaValueChange={event => {
          window.console.log(`${event} FOO radioOptionSelected`);
          setMonthInformationCorrect(event.detail.value);
        }}
        onRadioOptionSelected={event => {
          window.console.log(`${event} FOO radioOptionSelected`);
          setMonthInformationCorrect(event.detail.value);
        }}
        radioOptionSelected={event => {
          window.console.log(`${event}radioOptionSelected`);
          setMonthInformationCorrect(event.detail.value);
        }}
        required
      >
        <va-radio-option
          label="Yes, this information is correct"
          name="monthInformationCorrect"
          value="true"
        />
        <va-radio-option
          label="No, this information isn't correct"
          name="monthInformationIncorrect"
          value="false"
        />
      </va-radio> */}

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
            label: "No, this information isn't correct",
          },
        ]}
        required
        value={{ value: monthInformationCorrect }}
      />

      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        If you select, "No this information isn’t correct,"{' '}
        <strong>
          we’ll pause your monthly payments until you update your enrollment
          information.
        </strong>{' '}
        You also won’t be able to verify any future enrollments until you update
        your information.
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
