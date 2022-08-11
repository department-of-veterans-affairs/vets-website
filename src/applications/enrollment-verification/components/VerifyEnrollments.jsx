import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import PrivacyAgreement from 'platform/forms/components/PrivacyAgreement';

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
  requirePrivacyAgreement = false,
  totalProgressBarSegments,
}) {
  const [privacyAgreementChecked, setPrivacyAgreementChecked] = useState(false);
  const [showPrivacyAgreementError, setShowPrivacyAgreementError] = useState(
    false,
  );

  const onPrivacyAgreementChange = useCallback(checked => {
    setPrivacyAgreementChecked(checked);
    if (checked) {
      setShowPrivacyAgreementError(false);
    }
  }, []);

  const verifyPrivacyAgreement = useCallback(
    () => {
      if (requirePrivacyAgreement && !privacyAgreementChecked) {
        setShowPrivacyAgreementError(true);
        return;
      }

      if (requirePrivacyAgreement) {
        scrollToTop();
      }

      onForwardButtonClick();
    },
    [onForwardButtonClick, privacyAgreementChecked, requirePrivacyAgreement],
  );

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

      {requirePrivacyAgreement && (
        <>
          <p className="vads-u-margin-top--4">
            <strong>Note:</strong> According to federal law, there are criminal
            penalties, including a fine and/or imprisonment for up to 5 years,
            for withholding information or for providing incorrect information.
            (See 18 U.S.C. 1001)
          </p>
          <PrivacyAgreement
            checked={privacyAgreementChecked}
            onChange={onPrivacyAgreementChange}
            showError={showPrivacyAgreementError}
          />
        </>
      )}

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
          // disabled={requirePrivacyAgreement && !privacyAgreementChecked}
          id="2-continueButton"
          onClick={
            requirePrivacyAgreement
              ? verifyPrivacyAgreement
              : onForwardButtonClick
          }
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
  requirePrivacyAgreement: PropTypes.bool,
  result: PropTypes.string,
  submitted: PropTypes.bool,
};

export default connect()(VerifyEnrollments);
