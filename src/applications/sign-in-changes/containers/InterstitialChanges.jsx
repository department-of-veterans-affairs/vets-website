import React from 'react';
import { useSelector } from 'react-redux';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectProfile } from 'platform/user/selectors';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  const userHasLogingov =
    useSelector(state => selectProfile(state)?.logingovUuid) !== null;
  const userHasIdme =
    useSelector(state => selectProfile(state)?.idmeUuid) !== null;
  const showAccount = userHasLogingov || userHasIdme;
  const returnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/';
  return (
    <div className="row medium-screen:vads-u-max-width--900px login vads-u-margin-y--6 vads-u-margin-x--2">
      <h1
        id="signin-changes-title"
        className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
      >
        You’ll need to sign in with a different account after January 31, 2025
      </h1>
      <p className="vads-u-font-size--base section-content">
        After this date, we'll remove the <strong>My HealtheVet</strong> sign-in
        option. You’ll need to sign in using a <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account.
      </p>
      {showAccount ? (
        <AccountSwitch hasLogingov={userHasLogingov} />
      ) : (
        <CreateAccount />
      )}
      <h2 className="vads-u-margin-y--0">Or continue using your old account</h2>
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
