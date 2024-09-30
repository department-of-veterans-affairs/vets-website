import React from 'react';
// import { useSelector } from 'react-redux';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import { selectProfile } from 'platform/user/selectors';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  // const userEmail = useSelector(state => selectProfile(state)?.email);
  // const userHasLogingov =
  //   useSelector(state => selectProfile(state)?.logingovUuid) !== null;
  // const userHasIdme =
  //   useSelector(state => selectProfile(state)?.idmeUuid) !== null;
  // const returnUrl **generateReturnUrl();
  const userEmail = 'testuser@test.com';
  const userHasLogingov = 'dfskljflkd';
  const userHasIdme = 'kjlkjlkjfgl';
  const showAccount = userHasLogingov || userHasIdme;
  const returnUrl = '';
  return (
    <div className="row medium-screen:vads-u-max-width--900px login vads-u-margin-y--6">
      <h1
        id="signin-changes-title"
        className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
      >
        You’ll need to sign in with a different account after January 31, 2025
      </h1>
      <p className="vads-u-font-size--base">
        After this date, we'll remove the <strong>MyHealtheVet.gov</strong>{' '}
        sign-in option. You’ll need to sign in using a{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account.
      </p>
      {showAccount ? (
        <AccountSwitch hasLogingov={userHasLogingov} userEmail={userEmail} />
      ) : (
        <CreateAccount />
      )}
      <h2>Or continue using your old account</h2>
      <p className="vads-u-font-size--base">
        You’ll can use you <strong>MyHealtheVet.gov</strong> account to sign in
        until <strong>January 31, 2025</strong>.
      </p>
      <VaLink
        text="Continue with your MyHealtheVet account for now"
        href={returnUrl}
      />
    </div>
  );
}
