import React from 'react';
import PropTypes from 'prop-types';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import recordEvent from '~/platform/monitoring/record-event';
import { mfa } from '~/platform/user/authentication/utilities';

const mfaHandler = isAuthenticatedWithSSO => {
  recordEvent({ event: 'multifactor-link-clicked' });
  mfa(isAuthenticatedWithSSO ? 'v1' : 'v0');
};

const SetUp2FAAlert = ({ isAuthenticatedWithSSOe }) => {
  return (
    <AlertBox
      className="vads-u-margin-bottom--2"
      headline="You’ll need to set up 2-factor authentication before you can edit your direct deposit information."
      content={
        <>
          <p>
            We require this to help protect your bank account information and
            prevent fraud.
          </p>
          <p>
            Authentication gives you an extra layer of security by letting you
            into your account only after you’ve signed in with a password and a
            6-digit code sent directly to your mobile or home phone. This helps
            to make sure that no one but you can access your account - even if
            they get your password.
          </p>
          <button
            type="button"
            className="usa-button-primary va-button-primary"
            onClick={() => mfaHandler(isAuthenticatedWithSSOe)}
          >
            Set up 2-factor authentication
          </button>
        </>
      }
      status="continue"
      isVisible
    />
  );
};

SetUp2FAAlert.propTypes = {
  isAuthenticatedWithSSOe: PropTypes.bool.isRequired,
};

export default SetUp2FAAlert;
