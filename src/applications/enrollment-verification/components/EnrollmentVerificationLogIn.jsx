import React from 'react';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

export function EnrollmentVerificationLogin() {
  return (
    <va-alert status="continue" visible>
      <h3 slot="headline">
        Please sign in to verify your school enrollments for Post-9/11 GI Bill
      </h3>
      <p>
        Sign in with your existing <strong>ID.me</strong> account. If you don’t
        have an account, you can create a free <strong>ID.me</strong> account
        now.
      </p>
      <LoginModalButton className="usa-button-primary va-button-primary" />
    </va-alert>
  );
}

export default EnrollmentVerificationLogin;
