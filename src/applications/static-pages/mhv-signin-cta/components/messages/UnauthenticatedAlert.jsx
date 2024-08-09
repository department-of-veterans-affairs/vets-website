import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import CustomAlert from './CustomAlert';

/**
 * Alert to show a user that is not logged in.
 * @property {*} recordEvent the function to record the event
 * @property {string} status the status of the alert
 * @property {string} serviceDescription the description of the service that requires verification
 */
const UnauthenticatedAlert = ({
  recordEvent = recordEventFn,
  serviceDescription,
  status = 'continue',
}) => {
  const headline = serviceDescription
    ? `Sign in with a verified account to ${serviceDescription}`
    : 'Sign in with a verified account';

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': status,
      });
    },
    [headline, recordEvent, status],
  );

  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true));
  };

  return (
    <CustomAlert headline={headline} icon="lock" status="continue">
      <div>
        <p>
          You’ll need to sign in with a verified account through one of our
          account providers. Identity verification helps us protect your
          information and prevent fraud and identity theft.
        </p>
        <p>
          <strong>Don’t yet have a verified account?</strong> Create a{' '}
          <strong>Login.gov</strong> or <strong>ID.me</strong> account now. Then
          come back here and sign in. We’ll help you verify.
        </p>
        <p>
          <strong>Not sure if your account is verified?</strong> Sign in here.
          We’ll tell you if you need to verify.
        </p>
        <p>
          <va-button onClick={handleSignIn} text="Sign in or create account" />
        </p>
        <p>
          <va-link
            href="/resources/creating-an-account-for-vagov/"
            text="Learn about creating an account"
          />
        </p>
      </div>
    </CustomAlert>
  );
};

UnauthenticatedAlert.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  recordEvent: PropTypes.func,
  status: PropTypes.string,
};

export default UnauthenticatedAlert;
