import React from 'react';
import PropTypes from 'prop-types';

const SignInPrompt = ({ handleSignInClick }) => {
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

SignInPrompt.propTypes = {
  handleSignInClick: PropTypes.func,
};

export default SignInPrompt;
