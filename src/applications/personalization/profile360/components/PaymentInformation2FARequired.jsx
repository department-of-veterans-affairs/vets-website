import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { ssoe } from 'platform/user/authentication/selectors';
import { mfa } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';

function mfaHandler(useSSOe) {
  recordEvent({ event: 'multifactor-link-clicked' });
  mfa(useSSOe ? 'v1' : 'v0');
}

export function PaymentInformation2FARequired({ useSSOe }) {
  return (
    <AlertBox
      status="success"
      isVisible
      headline="You’ll need to set up 2-factor authentication before you can edit your direct deposit information."
    >
      <>
        <p>
          We require this to help protect your bank account information and
          prevent fraud.
        </p>
        <p>
          Authentication gives you an extra layer of security by letting you
          into your account only after you’ve signed in with a password and a
          6-digit code sent directly to your mobile or home phone. This helps to
          make sure that no one but you can access your account—even if they get
          your password.
        </p>
        <button
          className="usa-button-primary va-button-primary"
          onClick={() => mfaHandler(useSSOe)}
        >
          Set up 2-factor authentication
        </button>
      </>
    </AlertBox>
  );
}

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
  };
}

export default connect(mapStateToProps)(PaymentInformation2FARequired);
