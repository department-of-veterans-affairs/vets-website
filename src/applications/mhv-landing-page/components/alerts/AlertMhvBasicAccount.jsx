import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { VerifyButton } from '~/platform/user/authentication/components/VerifyButton';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';

const AlertMhvBasicAccount = ({ headline, recordEvent, testId }) => {
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
      datadogRum.addAction('Showed Alert Box: MHV Basic Account Warning');
    },
    [headline, recordEvent],
  );

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

AlertMhvBasicAccount.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertMhvBasicAccount;
