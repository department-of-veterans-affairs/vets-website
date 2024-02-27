import React from 'react';

import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const HowToVerifyLink = () => (
  <p className="vads-u-margin-y--4">
    <va-link
      href="/resources/verifying-your-identity-on-vagov/"
      text="Learn how to verify your identity on VA.gov"
      data-testid="verify-identity-link"
    />
  </p>
);

const IdentityNotVerified = ({
  headline = 'Verify your identity to access your complete profile',
  showHelpContent = true,
}) => {
  return (
    <>
      <va-alert status="continue" class="vads-u-margin-top--3">
        <h2 slot="headline" data-testid="verify-identity-alert-headline">
          {headline}
        </h2>

        <div className="vads-u-margin-bottom--1">
          <p>
            We need to make sure you’re you&#8212;and not someone pretending to
            be you&#8212;before we can give you access to your personal and
            health-related information. This helps to keep your information
            safe. It helps to prevent fraud and identity theft.
          </p>

          <p className="vads-u-font-weight--bold">
            This one-time process takes about 5-10 minutes.
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
    </>
  );
};

IdentityNotVerified.propTypes = {
  additionalInfoClickHandler: PropTypes.func,
  headline: PropTypes.string,
  showHelpContent: PropTypes.bool,
};

export { IdentityNotVerified as default };
