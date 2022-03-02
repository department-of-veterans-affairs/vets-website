import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationPageWrapper from './EnrollmentVerificationPageWrapper';
import FinishVerifyingLater from './FinishVerifyingLater';

export default function VerifyEnrollments({
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
  totalProgressBarSegments,
}) {
  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>
      <va-segmented-progress-bar
        current={currentProgressBarSegment}
        total={totalProgressBarSegments}
      />

      <h2 className="vads-u-font-size--h4 vads-u-margin-top--4 vads-u-margin-bottom--4">
        Step {currentProgressBarSegment} of {totalProgressBarSegments}:{' '}
        {progressTitlePostfix}
      </h2>

      {children}

      <FinishVerifyingLater onFinishVerifyingLater={onFinishVerifyingLater} />

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
};
