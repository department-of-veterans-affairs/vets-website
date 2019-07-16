import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from './../CallToActionAlert';

const SignIn = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `Please sign in to ${serviceDescription}`,
    alertText: (
      <p>
        Try signing in with your <b>DS Logon</b>, <b>My HealtheVet</b>, or{' '}
        <b>ID.me</b> account. If you don’t have any of those accounts, you can
        create one.
      </p>
    ),
    primaryButtonText: 'Sign in or create an account',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

SignIn.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default SignIn;
