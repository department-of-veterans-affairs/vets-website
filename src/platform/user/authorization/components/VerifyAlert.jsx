import React from 'react';
import { useSelector } from 'react-redux';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  CSP_IDS,
  ACTIVE_SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';

const BUTTON_BY_POLICY = {
  idme: VerifyIdmeButton,
  logingov: VerifyLogingovButton,
};

const VARIANT_BY_POLICY = {
  idme: 'verifyIdMe',
  logingov: 'verifyLoginGov',
};

const SLOT_BY_POLICY = {
  idme: 'IdMeVerifyButton',
  logingov: 'LoginGovVerifyButton',
};

export default function VerifyAlert({ headingLevel = 2, dataTestId }) {
  const csp = useSelector(signInServiceName);

  if (csp === CSP_IDS.DS_LOGON || csp === CSP_IDS.MHV) return null;

  const provider = ACTIVE_SERVICE_PROVIDERS[csp];
  if (!provider) return null;

  const { policy } = provider;

  const ButtonComponent = BUTTON_BY_POLICY[policy];
  const variant = VARIANT_BY_POLICY[policy];
  const slot = SLOT_BY_POLICY[policy];

  const queryParams = { operation: 'verify_cta_authenticated' };

  return (
    <VaAlertSignIn
      variant={variant}
      visible
      headingLevel={headingLevel}
      data-testid={dataTestId}
    >
      <span slot={slot}>
        <ButtonComponent queryParams={queryParams} />
      </span>
    </VaAlertSignIn>
  );
}
