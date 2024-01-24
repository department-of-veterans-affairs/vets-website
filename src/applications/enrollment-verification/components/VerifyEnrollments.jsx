import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EnrollmentVerificationPageWrapper from './EnrollmentVerificationPageWrapper';
import FinishVerifyingLater from './FinishVerifyingLater';

function VerifyEnrollments({
  backButtonText = (
    <>
      <span className="button-icon" aria-hidden="true">
        «&nbsp;
      </span>
      Back
    </>
  ),
  children,
  currentProgressBarSegment,
  forwardButtonText = (
    <>
      Continue
      <span className="button-icon" aria-hidden="true">
        &nbsp;»
      </span>
    </>
  ),
  onBackButtonClick,
  onFinishVerifyingLater,
  onForwardButtonClick,
  progressTitlePostfix,
  showPrivacyAgreement = false,
  totalProgressBarSegments,
}) {
  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-segmented-progress-bar
        current={currentProgressBarSegment}
        total={totalProgressBarSegments}
        uswds
      />

      <h2 className="vads-u-font-size--h4 vads-u-margin-top--4 vads-u-margin-bottom--4">
        Step {currentProgressBarSegment} of {totalProgressBarSegments}:{' '}
        {progressTitlePostfix}
      </h2>

      {children}

      {showPrivacyAgreement && (
        <>
          <p className="vads-u-margin-top--4">
            <strong>Note:</strong> According to federal law, there are criminal
            penalties, including a fine and/or imprisonment for up to 5 years,
            for withholding information or for providing incorrect information
            (See 18 U.S.C. 1001).{' '}
            <a
              href="https://www.va.gov/privacy-policy/"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about our privacy policy
            </a>
          </p>
        </>
      )}

      <FinishVerifyingLater
        className="vads-u-margin-top--4"
        onFinishVerifyingLater={onFinishVerifyingLater}
      />

      <div className="ev-actions vads-u-margin-top--2p5">
        <button
          type="button"
          className="usa-button-secondary vads-u-margin-y--0"
          id="1-continueButton"
          onClick={onBackButtonClick}
        >
          {backButtonText}
        </button>
        <button
          type="button"
          className="usa-button-primary vads-u-margin-y--0"
          // disabled={showPrivacyAgreement && !privacyAgreementChecked}
          id="2-continueButton"
          onClick={onForwardButtonClick}
        >
          {forwardButtonText}
        </button>
      </div>
    </EnrollmentVerificationPageWrapper>
  );
}

VerifyEnrollments.propTypes = {
  currentProgressBarSegment: PropTypes.number.isRequired,
  totalProgressBarSegments: PropTypes.number.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onFinishVerifyingLater: PropTypes.func.isRequired,
  onForwardButtonClick: PropTypes.func.isRequired,
  backButtonText: PropTypes.any,
  children: PropTypes.any,
  forwardButtonText: PropTypes.any,
  progressTitlePostfix: PropTypes.any,
  result: PropTypes.string,
  showPrivacyAgreement: PropTypes.bool,
  submitted: PropTypes.bool,
};

export default connect()(VerifyEnrollments);
