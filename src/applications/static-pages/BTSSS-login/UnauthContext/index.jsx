import React from 'react';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useDispatch } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

const UnauthContext = () => {
  const dispatch = useDispatch();
  const handleSigninClick = () => {
    recordEvent({ event: AUTH_EVENTS.LOGIN });
    dispatch(toggleLoginModal(true, 'btsss-login-widget'));
  };

  return (
    <va-alert-sign-in
      data-testid="btsss-login-alert"
      variant="signInRequired"
      heading-level={3}
      visible
    >
      <span slot="SignInButton">
        <va-button
          data-testid="btsss-login-button"
          onClick={handleSigninClick}
          text="Sign in or create an account"
        />
      </span>
    </va-alert-sign-in>
  );
};

export default UnauthContext;
