import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import CustomAlert from './CustomAlert';

export const headingPrefix = 'Sign in with a verified account';

/**
 * Alert to show a user that is not logged in.
 * @property {number} headerLevel the heading level
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription the description of the service that requires verification
 */
const UnauthenticatedAlert = ({
  headerLevel,
  recordEvent,
  serviceDescription,
}) => {
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true, 'mhv-signin-cta', true));
  };

  return (
    <div data-testid="mhv-unauthenticated-alert">
      <CustomAlert
        headerLevel={headerLevel}
        headline={headline}
        icon="lock"
        status="info"
        recordEvent={recordEvent}
      >
        <div>
          <p>
            You’ll need to sign in with an identity-verified account through one
            of our account providers. Identity verification helps us protect all
            Veterans’ information and prevent scammers from stealing your
            benefits.
          </p>
          <p>
            <strong>Don’t yet have a verified account?</strong> Create an{' '}
            <strong>ID.me</strong> or <strong>Login.gov</strong> account. We’ll
            help you verify your identity for your account now.
          </p>
          <p>
            <strong>Not sure if your account is verified?</strong> Sign in here.
            If you still need to verify your identity, we’ll help you do that
            now.
          </p>
          <p>
            <va-button
              onClick={handleSignIn}
              text="Sign in or create an account"
            />
          </p>
          <va-link
            href="/resources/creating-an-account-for-vagov/"
            text="Learn about creating an account"
          />
        </div>
      </CustomAlert>
    </div>
  );
};

UnauthenticatedAlert.propTypes = {
  headerLevel: PropTypes.number,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnauthenticatedAlert;
