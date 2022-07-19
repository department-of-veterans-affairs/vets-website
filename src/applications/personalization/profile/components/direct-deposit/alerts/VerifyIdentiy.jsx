import React, { useCallback } from 'react';
import { signup, signupUrl } from 'platform/user/authentication/utilities';
import { CSP_IDS } from 'platform/user/authentication/constants';

export default function VerifyIdentiy() {
  const signUp = useCallback(csp => {
    signup({ csp });
  }, []);
  return (
    <va-alert status="continue" visible>
      <h2 slot="headline" data-testid="direct-deposit-mfa-message">
        Verify your identity with Login.gov or ID.me to change your direct
        deposit information online
      </h2>
      <p>
        Before we give you access to change your direct deposit information, we
        need to make sure you’re you—and not someone pretending to be you. This
        helps us protect your bank account and prevent fraud.
      </p>
      <p>
        <strong>If you have a verified Login.gov or ID.me account</strong>, sign
        out now. Then sign back in with that account to continue.
      </p>
      <p>
        <strong>If you don’t have one of these accounts</strong>, you can create
        one and verify your identity now.
      </p>
      <p>
        <a
          href="#create-login.gov-account"
          onClick={() => signUp(CSP_IDS.LOGIN_GOV)}
          data-testid="direct-deposit-login-gov-sign-up-link"
        >
          Create a Login.gov account
        </a>
      </p>
      <p>
        <a
          href={signupUrl(CSP_IDS.ID_ME)}
          data-testid="direct-deposit-id-me-sign-up-link"
        >
          Create an ID.me account
        </a>
      </p>
      <p>
        <strong>Note:</strong> If you need help updating your direct deposit
        information, call us at <va-telephone contact="800-827-1000" /> (
        <a href="tel:711" aria-label="TTY: 7 1 1.">
          TTY: 711
        </a>
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-alert>
  );
}
