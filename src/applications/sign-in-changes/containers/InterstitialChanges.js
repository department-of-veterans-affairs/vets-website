import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  // **ADD USESELECTOR**
  const userEmail = 'testemail@email.com';
  const userHasLogingov = null;
  // const userHasIdme = null;
  // const showAccount = userHasLogingov || userHasIdme;
  return (
    <div className="row medium-screen:vads-u-max-width--900px">
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
      <AccountSwitch hasLogingov={userHasLogingov} userEmail={userEmail} />
      <CreateAccount />
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
