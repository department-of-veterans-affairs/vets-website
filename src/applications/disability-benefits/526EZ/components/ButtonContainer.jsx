import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

export default function ButtonContainer(props) {
  const {
    checkGuidanceStatus,
    isChoosingStatus,
    atGuidance,
    goBack,
    goForward,
    authenticate,
    isVerified,
    isLoggedIn,
    handleKeyPress,
  } = props;
  const { atIncreaseGuidance, atEbenefitsGuidance } = checkGuidanceStatus();

  return (
    <div>
      {!isChoosingStatus() && (
        <button type="button" className="usa-button-secondary" onClick={goBack}>
          <span className="button-icon">« </span>
          Back
        </button>
      )}
      {atIncreaseGuidance &&
        !isLoggedIn && (
          <a
            className="usa-button-primary"
            href="/disability/how-to-file-claim"
            onClick={authenticate}
          >
            Sign in and verify your identity
            <span className="button-icon"> »</span>
          </a>
        )}
      {atIncreaseGuidance &&
        isLoggedIn &&
        !isVerified && (
          <a
            className="usa-button-primary"
            href="/verify?next=/disability/how-to-file-claim"
          >
            Verify your identity
            <span className="button-icon"> »</span>
          </a>
        )}
      {atIncreaseGuidance &&
        isVerified && (
          <a
            className="usa-button-primary"
            href="/disability/how-to-file-claim"
          >
            Apply for Claim for Increase
            <span className="button-icon"> »</span>
          </a>
        )}
      {atEbenefitsGuidance && (
        <a
          className="usa-button-primary"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            isLoggedIn &&
            recordEvent({
              event: 'nav-ebenefits-click',
            })
          }
        >
          Go to eBenefits
          <span className="button-icon"> »</span>
        </a>
      )}
      {!atGuidance() && (
        <button
          className="usa-button-primary"
          onClick={goForward}
          onKeyPress={handleKeyPress}
        >
          Next
          <span className="button-icon"> »</span>
        </button>
      )}
    </div>
  );
}

ButtonContainer.propTypes = {
  checkGuidanceStatus: PropTypes.func.isRequired,
  isChoosingStatus: PropTypes.func.isRequired,
  atGuidance: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
};
