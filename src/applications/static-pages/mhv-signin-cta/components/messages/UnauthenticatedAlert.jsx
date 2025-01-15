import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const headingPrefix = 'Sign in with a verified account';

/**
 * Alert to show a user that is not logged in.
 * @property {number} headerLevel the heading level
 * @property {*} recordEvent the function to record the event
 * @property {string} serviceDescription the description of the service that requires verification
 */
const UnauthenticatedAlert = ({ headerLevel }) => {
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true, 'mhv-signin-cta', true));
  };

  return (
    <div data-testid="mhv-unauthenticated-alert">
      <va-alert-sign-in
        visible
        variant="signInRequired"
        heading-level={headerLevel}
      >
        <span slot="SignInButton">
          <va-button
            onClick={handleSignIn}
            text="Sign in or create an account"
          />
        </span>
      </va-alert-sign-in>
    </div>
  );
};

UnauthenticatedAlert.propTypes = {
  headerLevel: PropTypes.number,
  recordEvent: PropTypes.func,
  serviceDescription: PropTypes.string,
};

export default UnauthenticatedAlert;
