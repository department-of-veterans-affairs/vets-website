import React from 'react';
import { useSelector } from 'react-redux';
import { signInServiceName } from 'platform/user/authentication/selectors';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';

export default function TransitionAccountSuccess() {
  const signInService = useSelector(signInServiceName);
  const TRANSFERED_CSP = SERVICE_PROVIDERS[signInService].label;
  return (
    <main className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-padding--2">
        <h1 data-testid="header">Account transfer is complete</h1>
        <p>
          You have sucessfully transferred your My HealtheVet account to{' '}
          <strong data-testid="transfered_CSP">{TRANSFERED_CSP}</strong>. Your
          credentials and information are now associated with this new account.
          You have access to all of the same benefits and services you would
          normally use on My HealtheVet and VA.gov.
        </p>
        <p>
          As you continue to use VA services, please ensure that you use this
          account to sign in.
        </p>
      </div>
    </main>
  );
}
