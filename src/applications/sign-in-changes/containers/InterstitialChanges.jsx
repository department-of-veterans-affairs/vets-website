import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  // ***PLACE BACKEND CALL TO NEW ROUTE HERE***
  // backend call will return JSON payload containing stored user emails for modern creds.
  // mocked payload below
  const mockedUserEmails = {
    idme: 'idme@test.com',
    logingov: 'logingov@test.com',
  };

  const showAccount = mockedUserEmails?.logingov || mockedUserEmails?.idme;
  const returnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/';
  return (
    <div className="row vads-u-margin-y--6 vads-u-padding-x--2 login">
      <h1
        id="signin-changes-title"
        className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
      >
        You’ll need to sign in with a different account after January 31, 2025
      </h1>
      <p className="vads-u-font-size--base section-content vads-u-measure--5">
        After this date, we'll remove the <strong>My HealtheVet</strong> sign-in
        option. You’ll need to sign in using a <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account.
      </p>
      {showAccount ? (
        <AccountSwitch userEmails={mockedUserEmails} />
      ) : (
        <CreateAccount />
      )}
      <h2>Or continue using your old account</h2>
      <p className="vads-u-font-size--base">
        You’ll can use you <strong>My HealtheVet</strong> account to sign in
        until <strong>January 31, 2025</strong>.
      </p>
      <VaLink
        text="Continue with your My HealtheVet account for now"
        href={returnUrl}
      />
    </div>
  );
}
