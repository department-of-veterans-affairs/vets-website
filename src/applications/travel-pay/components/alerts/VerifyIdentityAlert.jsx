import React from 'react';
import { useSelector } from 'react-redux';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import {
  VerifyButton,
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

const VerifyIdentityAlert = () => {
  const signInService = useSelector(state => signInServiceName(state));

  if ([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV].includes(signInService)) {
    return (
      <va-alert-sign-in
        heading-level={2}
        variant={
          [CSP_IDS.ID_ME].includes(signInService)
            ? 'verifyIdMe'
            : 'verifyLoginGov'
        }
        visible
      >
        {[CSP_IDS.ID_ME].includes(signInService) ? (
          <span slot="IdMeVerifyButton">
            <VerifyIdmeButton />
          </span>
        ) : (
          <span slot="LoginGovVerifyButton">
            <VerifyLogingovButton />
          </span>
        )}
      </va-alert-sign-in>
    );
  }

  return (
    <va-alert-sign-in heading-level={2} variant="signInEither" visible>
      <span slot="LoginGovSignInButton">
        <VerifyButton csp="logingov" />
      </span>
      <span slot="IdMeSignInButton">
        <VerifyButton csp="idme" />
      </span>
    </va-alert-sign-in>
  );
};

export default VerifyIdentityAlert;
