import React from 'react';
import { useDispatch } from 'react-redux';
import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';

// alerts to be used during the transition period of MHV and DS Logon credential retirement

export const AccountSecurityLoa1CredAlert = () => {
  const dispatch = useDispatch();

  return (
    <>
      <VaAlertSignIn variant="signInRequired" visible headingLevel={2}>
        <span slot="SignInButton">
          <VaButton
            text="Sign in or create an account"
            onClick={() => dispatch(toggleLoginModal(true, 'dashboard', true))}
          />
        </span>
      </VaAlertSignIn>
    </>
  );
};

export const SignInEmailAlert = () => {
  return (
    <VaAlertSignIn variant="signInEither" visible headingLevel={2}>
      <span slot="LoginGovSignInButton">
        <VerifyButton csp="logingov" />
      </span>
      <span slot="IdMeSignInButton">
        <VerifyButton csp="idme" />
      </span>
    </VaAlertSignIn>
  );
};
