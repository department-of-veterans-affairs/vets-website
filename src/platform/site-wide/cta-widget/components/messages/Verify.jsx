import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from './../CallToActionAlert';

const Verify = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `Please verify your identity to ${serviceDescription}`,
    alertText: (
      <p>
        We take your privacy seriously, and we’re committed to protecting your
        information. You’ll need to verify your identity before we can give you
        access to your personal health information.
      </p>
    ),
    primaryButtonText: 'Verify your identity',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

Verify.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default Verify;
