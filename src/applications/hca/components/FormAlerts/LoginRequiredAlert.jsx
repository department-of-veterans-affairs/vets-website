import React from 'react';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

const LoginRequiredAlert = () => (
  <va-alert status="error">
    <h2 slot="headline">Please sign in to review your information</h2>
    <p>
      We’re sorry for the interruption, but we’ve found some more information
      that we need you to review before you can apply for VA health care. Please
      sign in to VA.gov to review. If you don’t have an account, you can create
      one now.
    </p>
    <LoginModalButton message="Sign in to VA.gov" />
  </va-alert>
);

export default LoginRequiredAlert;
