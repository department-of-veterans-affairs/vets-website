import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring';
import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';

const SignInPrompt = () => {
  const dispatch = useDispatch();
  const handleSignInClick = () => {
    recordEvent({ event: AUTH_EVENTS.LOGIN });
    dispatch(toggleLoginModal(true));
  };

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <h2 slot="headline">You might already have an assigned priority group</h2>
      <div>
        <p className="vads-u-margin-y--0">
          If you have already applied for VA health care, you may have been
          assigned a priority group. Once you are signed in, your priority group
          assignment will be viewable here.
        </p>
        <button
          className="usa-button-primary"
          type="button"
          onClick={handleSignInClick}
        >
          Sign in to view your priority group
        </button>
      </div>
    </va-alert>
  );
};

export default SignInPrompt;
