import React from 'react';
import { connect } from 'react-redux';

import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { mfa } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';

function mfaHandler(authenticatedWithSSOe) {
  recordEvent({ event: 'multifactor-link-clicked' });
  mfa(authenticatedWithSSOe ? 'v1' : 'v0');
}

export function MultifactorMessage({ multifactor, authenticatedWithSSOe }) {
  if (multifactor) {
    return (
      <div>
        <h3>Account security</h3>
        <p>
          <i className="fa fa-check-circle" /> You've added an extra layer of
          security to your account with 2-factor authentication.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4>Want to make your account more secure?</h4>
      <p>
        Add an extra layer of security (called 2-factor authentication). This
        helps to make sure only you can access your account—even if someone gets
        your password.
      </p>
      <button
        className="usa-button-primary"
        onClick={() => mfaHandler(authenticatedWithSSOe)}
      >
        Set up 2-factor authentication
      </button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
}
export default connect(mapStateToProps)(MultifactorMessage);
