import React, { useSelector } from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectProfile } from 'platform/user/selectors';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  const userEmail = useSelector(state => selectProfile(state)?.email);
  const userHasLogingov =
    useSelector(state => selectProfile(state)?.logingovUuid) !== null;
  const userHasIdme =
    useSelector(state => selectProfile(state)?.idmeUuid) !== null;
  const showAccount = userHasLogingov || userHasIdme;
  return (
    <div className="row medium-screen:vads-u-max-width--900px login">
      <h1
        id="signin-changes-title"
        className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
      >
        We’ll remove the My HealtheVet sign-in option after January 31, 2025
      </h1>
      <VaLink
        text="Learn about why we are making changes to sign in"
        href="https://www.va.gov/initiatives/prepare-for-vas-secure-sign-in-changes/"
      />
      {showAccount ? (
        <AccountSwitch hasLogingov={userHasLogingov} userEmail={userEmail} />
      ) : (
        <CreateAccount />
      )}
      <VaLink
        text="Continue to VA.gov and complete this step later"
        href="va.gov"
      />
      <p className="vads-u-font-size--base">
        You’ll still be able to use the <strong>MyHealtheVet.gov</strong>{' '}
        website, but you’ll need to sign in with a <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account after <strong>January 31, 2025.</strong>
      </p>
    </div>
  );
}
