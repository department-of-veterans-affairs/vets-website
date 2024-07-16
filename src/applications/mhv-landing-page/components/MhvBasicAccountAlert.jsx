import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { logoutUrlSiS } from '~/platform/utilities/oauth/utilities';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MhvBasicAccountAlert = ({ headline, recordEvent, status }) => {
  useEffect(() => {
    recordEvent({
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': status,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = () => {
    window.location = logoutUrlSiS;
  };

  return (
    <VaAlert
      status={status}
      data-testid="mhv-basic-account-alert"
      disableAnalytics
    >
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--0">
          To protect your health information and prevent fraud and identity
          theft, we can only give you access when you sign in with a verified
          account. You have 2 options: a verified Login.gov or a verified ID.me
          account.
        </p>
        <p>
          <b>If you already have a Login.gov or ID.me account</b>, sign out of
          VA.gov. Then sign back in using that account. We’ll tell you if you
          need to verify your identity or take any other steps.
        </p>
        <p>
          <b>If you want to create a Login.gov account</b>, follow these steps:
        </p>
        <ul>
          <li>Sign out of VA.gov</li>
          <li>
            On the VA.gov homepage, select <b>Create an account</b>. Create a{' '}
            <b>Login.gov</b> account.
          </li>
          <li>
            Come back to <b>VA.gov</b> and sign in with your <b>Login.gov</b>{' '}
            account. We’ll help you verify your identity and register your
            account to access My HealtheVet on VA.gov.
          </li>
        </ul>
        <p>
          <b>If you want to create an ID.me account</b>, you should know that we
          started this process for you when you signed in to VA.gov. Follow
          these steps to finish creating your account:
        </p>
        <ul>
          <li>Sign out of VA.gov</li>
          <li>
            On the VA.gov homepage, select <b>Sign in</b>. Select <b>Sign in</b>{' '}
            from the sign-in options.
          </li>
          <li>
            On the <b>ID.me</b> sign-in screen, select <b>Forgot password</b>.
            Enter the email address you used when you signed in to VA.gov.
          </li>
          <li>
            Set up a new password and finish signing in using <b>ID.me</b>.
            Then, <b>ID.me</b> will help you finish creating your account.
          </li>
          <li>
            Come back to VA.gov and sign in with your <b>ID.me</b> account.
            We’ll help you verify your identity and register your account to
            access My HealtheVet on VA.gov.
          </li>
        </ul>
        <div className="alert-actions">
          <va-button label="Sign out" onClick={signOut} text="Sign out" />
        </div>
        <p className="vads-u-margin-top--2">
          <a href="https://www.va.gov/resources/creating-an-account-for-vagov/">
            Learn more about how to access My HealtheVet on Va.gov
          </a>
        </p>
      </div>
    </VaAlert>
  );
};

MhvBasicAccountAlert.defaultProps = {
  headline:
    'You need to sign in with a different account to access My HealtheVet',
  recordEvent: recordEventFn,
  status: 'warning',
};

MhvBasicAccountAlert.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  status: PropTypes.string,
};

export default MhvBasicAccountAlert;
