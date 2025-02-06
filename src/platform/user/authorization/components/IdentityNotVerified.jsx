import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from './VerifyAlert';

export const HowToVerifyLink = () => (
  <p className="vads-u-margin-y--4">
    <va-link
      href="/resources/verifying-your-identity-on-vagov/"
      text="Learn how to verify your identity on VA.gov"
      data-testid="verify-identity-link"
    />
  </p>
);

const VerifyIdentityInfo = () => (
  <va-additional-info
    trigger="If you have trouble verifying your identity"
    uswds
  >
    <a
      href="https://www.va.gov/resources/verifying-your-identity-on-vagov/"
      className="vads-u-padding-bottom--2"
    >
      Get answers to common questions about verifying your identity
    </a>
    <div className="vads-u-margin-top--2p5">
      <p>
        Or, if you have a Premium My HealtheVet account with a My HealtheVet
        user ID and password, you can sign out and then sign back in with that
        account to access My HealtheVet.
      </p>
    </div>
  </va-additional-info>
);

const IdentityNotVerified = ({
  showHelpContent = true,
  showVerifyIdenityHelpInfo = false,
}) => {
  return (
    <>
      <VerifyAlert headingLevel={2} />

      {showHelpContent && <HowToVerifyLink />}
      {showVerifyIdenityHelpInfo && <VerifyIdentityInfo />}
    </>
  );
};

IdentityNotVerified.propTypes = {
  showHelpContent: PropTypes.bool,
  showVerifyIdenityHelpInfo: PropTypes.bool,
};

export { IdentityNotVerified as default };
