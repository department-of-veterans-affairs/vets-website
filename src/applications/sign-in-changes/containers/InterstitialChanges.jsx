import React, { useState, useEffect } from 'react';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import CreateAccount from '../components/CreateAccount';
import AccountSwitch from '../components/AccountSwitch';

export default function InterstitialChanges() {
  const [userEmails, setUserEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title =
      'The DS Logon sign-in option is going away soon | Veterans Affairs';

    apiRequest('/user/credential_emails', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        setUserEmails(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  }, []);

  const showAccount = userEmails?.logingov || userEmails?.idme;
  const returnUrl =
    sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '/my-va';

  if (isLoading) {
    return <VaLoadingIndicator />;
  }

  if (error) {
    window.location = '/my-va';
  }

  return (
    <div className="row vads-u-margin-y--6 vads-u-padding-x--2 login">
      <h1
        id="interstitialH1"
        className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
      >
        We’ll remove the DS Logon sign-in option after September 30, 2025
      </h1>
      <p
        className="vads-u-font-size--base section-content vads-u-measure--5"
        id="interstitialP"
        data-testid="interstitialP"
      >
        After this date, we’ll remove the <strong>DS Logon</strong> sign-in
        option. You’ll need to sign in using a <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account.
      </p>
      {showAccount ? (
        <AccountSwitch userEmails={userEmails} />
      ) : (
        <CreateAccount />
      )}
      <h2 id="interstitialH2">Or continue with DS Logon</h2>
      <p className="vads-u-font-size--base" id="interstitialMhvP">
        You can use your <strong>DS Logon</strong> account to sign in until
        September 30, 2025.
      </p>
      <va-link-action
        text="Continue with your DS Logon account for now"
        href={returnUrl}
        id="interstitialVaLink"
        type="secondary"
      />
    </div>
  );
}
