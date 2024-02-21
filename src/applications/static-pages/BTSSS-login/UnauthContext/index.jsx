import React from 'react';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useDispatch } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

const UnauthContext = () => {
  const dispatch = useDispatch();
  const handleSigninClick = () => {
    recordEvent({ event: AUTH_EVENTS.LOGIN });
    dispatch(toggleLoginModal(true, 'coronavirus-vaccination'));
  };

  return (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
        uswds
      >
        <h3 id="track-your-status-on-mobile" slot="headline">
          Sign in to file a travel pay claim
        </h3>
        <div>
          <p className="vads-u-margin-top--0">
            Sign in with your existing <strong>Login.gov</strong>,{' '}
            <strong>ID.me</strong>, <strong>DS Logon</strong>, or{' '}
            <strong>My HealtheVet</strong> account. If you don’t have any of
            these accounts, you can create a free <strong>Login.gov</strong> or{' '}
            <strong>ID.me</strong> account now.
          </p>
          <va-button
            onClick={handleSigninClick}
            primary-alternate
            text="Sign in or create an account"
            uswds
          />
        </div>
      </va-alert>
    </>
  );
};

export default UnauthContext;
