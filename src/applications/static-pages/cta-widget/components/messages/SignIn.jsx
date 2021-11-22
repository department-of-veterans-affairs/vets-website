import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const SignIn = ({
  serviceDescription,
  primaryButtonHandler,
  headerLevel,
  ariaLabel = null,
  ariaDescribedby = null,
}) => {
  const content = {
    heading: `Please sign in to ${serviceDescription}`,
    headerLevel,
    alertText: (
      <p>
        Try signing in with your <strong>DS Logon</strong>,
        <strong>My HealtheVet</strong>, or <strong>ID.me</strong> account. If
        you don’t have any of those accounts, you can create one now.
      </p>
    ),
    primaryButtonText: 'Sign in or create an account',
    primaryButtonHandler,
    status: 'continue',
    ariaLabel,
    ariaDescribedby,
  };

  return <CallToActionAlert {...content} />;
};

SignIn.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
  headerLevel: PropTypes.number,
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.string,
};

export default SignIn;
