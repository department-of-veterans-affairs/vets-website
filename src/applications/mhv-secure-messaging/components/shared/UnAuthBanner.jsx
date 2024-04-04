import React from 'react';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useDispatch } from 'react-redux';

const UnAuthBanner = () => {
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true, 'mhv-sm-landing-page'));
  };
  return (
    <va-alert
      background-only
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <div>
        <h3 className="vads-u-margin-top--0" slot="headline">
          Sign in to send secure messages
        </h3>
        <p className="vads-u-margin-top--0">
          Sign in with your
          <strong> Login.gov</strong>, <strong>ID.me</strong>, or{' '}
          <strong>My HealtheVet</strong> account. If you don’t have any of these
          accounts, you can create a free account now.
        </p>
        <va-button
          onClick={handleSignIn}
          primary-alternate
          text="Sign in or create account"
        />
      </div>
    </va-alert>
  );
};

export default UnAuthBanner;
