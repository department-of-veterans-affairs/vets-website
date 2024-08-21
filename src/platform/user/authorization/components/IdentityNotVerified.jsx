import React from 'react';

import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { CSP_IDS } from '../../authentication/constants';

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
  disableAnalytics = false,
  headline = 'Verify your identity to access your complete profile',
  showHelpContent = true,
  showVerifyIdenityHelpInfo = false,
  signInService,
}) => {
  const serviceNameMapping = {
    [CSP_IDS.MHV]: 'Login.gov or ID.me',
    [CSP_IDS.MHV_VERBOSE]: 'Login.gov or ID.me',
    [CSP_IDS.DS_LOGON]: 'Login.gov or ID.me',
    [CSP_IDS.ID_ME]: 'ID.me',
    [CSP_IDS.LOGIN_GOV]: 'Login.gov',
  };

  const serviceName = serviceNameMapping[signInService] || '';

  return (
    <>
      <va-alert
        status="continue"
        class="vads-u-margin-top--3 vads-u-margin-bottom--3"
        disable-analytics={disableAnalytics}
      >
        <h2 slot="headline" data-testid="verify-identity-alert-headline">
          {headline}
        </h2>
        <div className="vads-u-margin-bottom--1">
          <p>
            {`Our records show that you haven’t verified your identity for your
            ${serviceName} account. We need you to verify your identity for this
            account to help us keep your information safe and prevent fraud and
            identity theft.`}
          </p>
          <p>
            {serviceName || 'Your account'} will ask you for certain personal
            information and identification. This process often takes about 10
            minutes.
          </p>
          <a
            className="vads-c-action-link--green"
            href="/verify"
            onClick={() => recordEvent({ event: AUTH_EVENTS.VERIFY })}
          >
            Verify your identity
          </a>
        </div>
      </va-alert>

      {showHelpContent && <HowToVerifyLink />}
      {showVerifyIdenityHelpInfo && <VerifyIdentityInfo />}
    </>
  );
};

IdentityNotVerified.propTypes = {
  signInService: PropTypes.string.isRequired,
  additionalInfoClickHandler: PropTypes.func,
  disableAnalytics: PropTypes.bool,
  headline: PropTypes.string,
  showHelpContent: PropTypes.bool,
  showVerifyIdenityHelpInfo: PropTypes.bool,
};

export { IdentityNotVerified as default };
