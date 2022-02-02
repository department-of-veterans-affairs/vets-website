import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import { fetchVerificationStatus } from '../actions';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';

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

  if (!verificationStatus) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  const unverifiedMonths = verificationStatus?.months?.filter(m => m.verified);

  // TODO
  // if (!unverifiedMonths || !unverifiedMonths.length) {
  // window.location.html = '';
  // }

  const currentMonthIndex = 0;
  const month = unverifiedMonths[currentMonthIndex];

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-segmented-progress-bar
        current={currentMonthIndex + 1}
        total={unverifiedMonths.length}
      />

      <h2>
        Step {currentMonthIndex + 1} of {unverifiedMonths.length}: Verify{' '}
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
      </va-alert>

      <br />

      <div className="ev-highlighted-content-container">
        <header className="ev-highlighted-content-container_header">
          <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
            September 2021
          </h1>
        </header>
        <div className="ev-highlighted-content-container_content">
          <p>
            This is the enrollment information we have on file for you for
            September 2021.
          </p>
          <div className="ev-info-block">
            <p>
              <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
              University School of Business
            </p>
            <p>
              <strong>Total credit hours:</strong> [#]
            </p>
            <p>
              <strong>[Start date] &ndash; [End date]</strong> at Adirondack
              Community College
            </p>
            <p>
              <strong>Total credit hours:</strong>
              [#]
            </p>
          </div>
        </div>
      </div>

      <RadioButtons
        errorMessage=""
        label="This is a Label"
        onKeyDown={function noRefCheck() {}}
        onMouseDown={function noRefCheck() {}}
        onValueChange={function noRefCheck() {}}
        options={[
          'Yes, this information is correct',
          "No, this information isn't correct",
        ]}
        required
        value={{
          value: 'First option',
        }}
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
