import React from 'react';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useDispatch } from 'react-redux';

const UnAuthBanner = () => {
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(toggleLoginModal(true, 'mhv-sm-landing-page'));
  };
  return (
    <va-alert-sign-in variant="signInRequired" visible heading-level={3}>
      <span slot="SignInbutton">
        <va-button onClick={handleSignIn} text="Sign in or create account" />
      </span>
    </va-alert-sign-in>
  );
};

export default UnAuthBanner;
