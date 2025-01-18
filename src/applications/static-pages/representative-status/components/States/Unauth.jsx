import React from 'react';
import PropTypes from 'prop-types';

export const Unauth = ({ toggleLoginModal, headingLevel }) => {
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
            uswds
            onClick={() => toggleLoginModal(true)}
          />
        </span>
      </va-alert-sign-in>
    </>
  );
};

Unauth.propTypes = {
  headingLevel: PropTypes.number,
  toggleLoginModal: PropTypes.func,
};
