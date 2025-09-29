/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';

const SignInAlert = () => {
  const loggedIn = useSelector(isLoggedIn);
  const dispatch = useDispatch();
  return (
    !loggedIn && (
      <va-alert status="info">
        <div>
          <p className="vads-u-margin-top--0">
            It may take some time to complete this form. Sign in to save your
            progress.
          </p>
          <button
            type="button"
            className="va-button-link"
            onClick={() => dispatch(toggleLoginModal(true))}
          >
            Sign in to start your application.
          </button>
        </div>
      </va-alert>
    )
  );
};

export default SignInAlert;
