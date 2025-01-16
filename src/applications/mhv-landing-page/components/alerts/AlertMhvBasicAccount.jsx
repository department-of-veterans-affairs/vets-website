import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { VerifyButton } from '~/platform/user/authentication/components/VerifyButton';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
    <VaAlert status="warning" data-testid={testId} disableAnalytics>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--0">
          We need you to sign in with an identity-verified account. This helps
          us protect all Veterans’ information and prevent scammers from
          stealing your benefits. You have 2 options: a verified{' '}
          <strong>Login.gov</strong> or a verified <strong>ID.me</strong>{' '}
          account.
        </p>
        <p>
          <strong>If you already have a Login.gov or ID.me account,</strong>{' '}
          sign in with that account. If you still need to verify your identity
          for your account, we’ll help you do that now.
        </p>
        <p>
          <strong>If you don’t have a Login.gov or ID.me account,</strong>{' '}
          create one now. We’ll help you verify your identity.
        </p>
        <p>
          <VerifyButton csp={CSP_IDS.LOGIN_GOV} />
        </p>
        <p>
          <VerifyButton csp={CSP_IDS.ID_ME} />
        </p>
        <va-link
          href="/resources/creating-an-account-for-vagov/"
          text="Learn about creating an account"
        />
      </div>
    </VaAlert>
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
