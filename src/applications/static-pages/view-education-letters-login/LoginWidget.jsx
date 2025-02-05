import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

const LoginInWidget = () => {
  const dispatch = useDispatch();
  const currentlyLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const isLoading = useSelector(state => state?.user?.profile?.loading);
  const toggleLogin = e => {
    e.preventDefault();
    dispatch(toggleLoginModal(true, 'cta-form'));
  };

  if (isLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  }

  return currentlyLoggedIn ? (
    <a
      className="vads-c-action-link--green"
      href="/education/download-letters/letters"
    >
      Download your VA education decision letter
    </a>
  ) : (
    <va-alert-sign-in variant="signInRequired" visible heading-level={3}>
      <span slot="SignInButton">
        <va-button onClick={toggleLogin} text="Sign in or create an account" />
      </span>
    </va-alert-sign-in>
  );
};

export default LoginInWidget;
