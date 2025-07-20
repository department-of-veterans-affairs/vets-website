import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { VerifyButton } from '~/platform/user/authentication/components/VerifyButton';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';

interface AlertMhvBasicAccountProps {
  headline?: string;
  recordEvent?(...args: unknown[]): unknown;
  testId?: string;
}

const AlertMhvBasicAccount = ({
  headline,
  recordEvent,
  testId
}: AlertMhvBasicAccountProps) => {
  useEffect(() => {
    recordEvent({
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': 'warning',
    });
    datadogRum.addAction('Showed Alert Box: MHV Basic Account Warning');
  }, [headline, recordEvent]);

  return (
    <VaAlertSignIn
      variant="signInEither"
      data-testid={testId}
      visible
      disableAnalytics
    >
      <span slot="LoginGovSignInButton">
        <VerifyButton csp={CSP_IDS.LOGIN_GOV} />
      </span>
      <span slot="IdMeSignInButton">
        <VerifyButton csp={CSP_IDS.ID_ME} />
      </span>
    </VaAlertSignIn>
  );
};

AlertMhvBasicAccount.defaultProps = {
  headline: 'You need to sign in with a different account',
  recordEvent: recordEventFn,
  testId: 'mhv-alert--mhv-basic-account',
};

export default AlertMhvBasicAccount;
