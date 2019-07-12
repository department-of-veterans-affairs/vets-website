import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const MFA = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `Please set up 2-factor authentication to ${serviceDescription}`,
    alertText: (
      <p>
        We’re committed to protecting your information and preventing fraud.
        You’ll need to add an extra layer of security to your account with
        2-factor authentication before we can give you access to your bank
        account information.
      </p>
    ),
    primaryButtonText: 'Set up 2-factor authentication',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

MFA.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default MFA;
