import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AlertMhvBasicAccount = ({ headline, recordEvent, testId }) => {
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
    },
    [headline, recordEvent],
  );

  return (
    <VaAlertSignIn variant="signInEither" visible data-testid={testId}>
      <span slot="LoginGovSignInButton">
        <VerifyLogingovButton csp="logingov" />
      </span>
      <span slot="IdMeSignInButton">
        <VerifyIdmeButton csp="idme" />
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
