import React from 'react';
import PropTypes from 'prop-types';

export const Unauth = ({ toggleLoginModal, headingLevel = 2 }) => {
  return (
    <>
      <va-alert-sign-in
        variant="signInRequired"
        visible
        heading-level={headingLevel}
      >
        <span slot="SignInButton">
          <va-button
            text="Sign in or create an account"
            onClick={() => toggleLoginModal(true)}
          />
        </span>
      </va-alert-sign-in>
    </>
  );
};

Unauth.propTypes = {
  headingLevel: PropTypes.string,
  toggleLoginModal: PropTypes.func,
};
