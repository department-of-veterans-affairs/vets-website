import React from 'react';
import { useSelector } from 'react-redux';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { CSP_IDS } from '../constants';
import { signInServiceName } from '../selectors';
import { VerifyIdmeButton, VerifyLogingovButton } from './VerifyButton';

export default function VerifyAlert({ headingLevel = 2 }) {
  const csp = useSelector(signInServiceName);

  if (csp === CSP_IDS.DS_LOGON) {
    return null;
  }

  if (csp === CSP_IDS.MHV) {
    return (
      <VaAlertSignIn variant="signInEither" visible headingLevel={headingLevel}>
        <span slot="LoginGovSignInButton">
          <VerifyLogingovButton />
        </span>
        <span slot="IdMeSignInButton">
          <VerifyIdmeButton />
        </span>
      </VaAlertSignIn>
    );
  }

  const variant = csp === CSP_IDS.LOGIN_GOV ? 'verifyLoginGov' : 'verifyIdMe';
  const spanSlot =
    csp === CSP_IDS.LOGIN_GOV ? (
      <span slot="LoginGovVerifyButton">
        <VerifyLogingovButton />
      </span>
    ) : (
      <span slot="IdMeVerifyButton">
        <VerifyIdmeButton />
      </span>
    );

  return (
    <VaAlertSignIn variant={variant} visible headingLevel={headingLevel}>
      {spanSlot}
    </VaAlertSignIn>
  );
}
