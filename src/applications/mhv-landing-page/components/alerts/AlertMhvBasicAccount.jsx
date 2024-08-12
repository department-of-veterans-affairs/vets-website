import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { logoutUrl } from 'platform/user/authentication/utilities';
import { logoutUrlSiS } from '~/platform/utilities/oauth/utilities';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AlertMhvBasicAccount = ({ headline, recordEvent, testId, ssoe }) => {
  useEffect(() => {
    recordEvent({
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': 'warning',
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = () => {
    window.location = ssoe ? logoutUrl() : logoutUrlSiS();
  };

  return (
    <VaAlert status="warning" data-testid={testId} disableAnalytics>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--0">
          To protect your health information and prevent fraud and identity
          theft, we can only give you access when you sign in with a verified
          account. You have 2 options: a verified <b>Login.gov</b> or a verified{' '}
          <b>ID.me</b> account.
        </p>
        <p>
          <b>If you already have a Login.gov or ID.me account</b>, sign out of
          VA.gov. Then sign back in using that account. We’ll tell you if you
          need to verify your identity or take any other steps.
        </p>
        <p>
          <b>If you want to create an account now</b>, follow these steps:
        </p>
        <ul>
          <li>Sign out of VA.gov</li>
          <li>
            On the VA.gov homepage, select <b>Create an account</b>. Create a{' '}
            <b>Login.gov</b> or <b>ID.me</b> account.
          </li>
          <li>
            Come back to VA.gov and sign in with your <b>Login.gov</b> or{' '}
            <b>ID.me</b> account. We’ll help you verify your identity and
            register your account to access My HealtheVet on VA.gov.
          </li>
        </ul>
        <p>
          <b>Not sure if you already have a Login.gov or ID.me account?</b>
        </p>
        <p>
          You may have one if you’ve ever signed in to a federal website to
          manage your benefits—like Social Security or disability benefits. Or
          we may have started creating an <b>ID.me</b> account for you when you
          signed in to VA.gov.
        </p>
        <p>
          To check, sign out of VA.gov. Then try to create a <b>Login.gov</b> or{' '}
          <b>ID.me</b>
          account with the email address you think you may have used for that
          account in the past. If you already have an account, the sign-in
          service provider will tell you. You can then try to reset your
          password for that account.
        </p>
        <div className="vads-u-margin-top--2">
          <VaButton label="Sign out" onClick={signOut} text="Sign out" />
        </div>
        <p className="vads-u-margin-top--2">
          <a href="/resources/how-to-access-my-healthevet-on-vagov">
            Learn more about how to access My HealtheVet on Va.gov
          </a>
        </p>
      </div>
    </VaAlert>
  );
};

AlertMhvBasicAccount.defaultProps = {
  headline:
    'You need to sign in with a different account to access My HealtheVet',
  recordEvent: recordEventFn,
  ssoe: false,
  testId: 'mhv-alert--mhv-basic-account',
};

AlertMhvBasicAccount.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  ssoe: PropTypes.bool,
  testId: PropTypes.string,
};

export default AlertMhvBasicAccount;
