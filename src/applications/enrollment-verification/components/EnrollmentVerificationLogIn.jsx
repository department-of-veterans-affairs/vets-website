import React from 'react';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

export function EnrollmentVerificationLogin() {
  return (
    <va-alert status="continue" visible>
      <h1
        className="vads-u-font-size--h1 vads-u-font-weight--bold"
        slot="headline"
      >
        Please sign in to verify your enrollment
      </h1>
      <p>
        Sign in with your existing <strong>ID.me</strong> or{' '}
        <strong>Login.gov</strong> account. If you don’t have an account, you
        can create a free{' '}
        <a href="https://api.id.me/" target="_blank" rel="noreferrer">
          ID.me
        </a>{' '}
        account or{' '}
        <a href="https://secure.login.gov/" target="_blank" rel="noreferrer">
          Login.gov
        </a>{' '}
        account now.
      </p>
      <LoginModalButton className="usa-button-primary va-button-primary" />
    </va-alert>
  );
}

export default EnrollmentVerificationLogin;
