import React from 'react';
import { useSelector } from 'react-redux';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';

export default function VerifyAlert({ headingLevel = 2, dataTestId }) {
  const csp = useSelector(signInServiceName);

  if (csp === CSP_IDS.DS_LOGON) {
    return null;
  }

  if (csp === CSP_IDS.MHV) {
    return (
      <VaAlertSignIn
        variant="signInEither"
        visible
        headingLevel={headingLevel}
        data-testid={dataTestId}
      >
        <span slot="IdMeSignInButton">
          <VerifyIdmeButton
            queryParams={{ operation: 'verify_cta_authenticated' }}
          />
        </span>
        <span slot="LoginGovSignInButton">
          <VerifyLogingovButton
            queryParams={{ operation: 'verify_cta_authenticated' }}
          />
        </span>
      </VaAlertSignIn>
    );
  }

  const variant = csp === CSP_IDS.LOGIN_GOV ? 'verifyLoginGov' : 'verifyIdMe';
  const spanSlot =
    csp === CSP_IDS.LOGIN_GOV ? (
      <span slot="LoginGovVerifyButton">
        <VerifyLogingovButton
          queryParams={{ operation: 'verify_cta_authenticated' }}
        />
      </span>
    ) : (
      <span slot="IdMeVerifyButton">
        <VerifyIdmeButton
          queryParams={{ operation: 'verify_cta_authenticated' }}
        />
      </span>
    );

  return (
    <VaAlertSignIn
      variant={variant}
      visible
      headingLevel={headingLevel}
      data-testid={dataTestId}
    >
      {spanSlot}
    </VaAlertSignIn>
  );
}
