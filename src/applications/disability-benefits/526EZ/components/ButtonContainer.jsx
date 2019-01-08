import React from 'react';
import PropTypes from 'prop-types';

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
            href="/disability-benefits/apply/form-526-disability-claim/introduction/"
            onClick={authenticate}
          >
            Sign In and Verify Your Identity
            <span className="button-icon"> »</span>
          </a>
        )}
      {atIncreaseGuidance &&
        isLoggedIn &&
        !isVerified && (
          <a
            className="usa-button-primary"
            href="/verify?next=/disability-benefits/apply/form-526-disability-claim/introduction/"
          >
            Verify Your Identity
            <span className="button-icon"> »</span>
          </a>
        )}
      {atIncreaseGuidance &&
        isVerified && (
          <a
            className="usa-button-primary"
            href="/disability-benefits/apply/form-526-disability-claim/introduction/"
          >
            Apply for Claim for Increase
            <span className="button-icon"> »</span>
          </a>
        )}
      {atEbenefitsGuidance && (
        <a
          className="usa-button-primary"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
          rel="noopener"
          target="_blank"
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
