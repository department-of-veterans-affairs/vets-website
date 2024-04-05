import React from 'react';
import PropTypes from 'prop-types';

export const Unauth = ({ toggleLoginModal, DynamicHeader }) => {
  return (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <DynamicHeader>
          Sign in to check if you have an accredited representative
        </DynamicHeader>
        <React.Fragment key=".1">
          <p>
            Sign in with your existing{' '}
            <strong>Login.gov, ID.me, DS Logon,</strong> or{' '}
            <strong>My HealtheVet</strong> account. If you don’t have any of
            these accounts, you can create a free <strong>Login.gov</strong> or{' '}
            <strong>ID.me</strong> account now.
          </p>
          <va-button
            primary-alternate
            text="Sign in or create an account"
            uswds
            onClick={() => toggleLoginModal(true)}
          />
        </React.Fragment>
      </va-alert>
    </>
  );
};

Unauth.propTypes = {
  DynamicHeader: PropTypes.string,
  toggleLoginModal: PropTypes.func,
};
