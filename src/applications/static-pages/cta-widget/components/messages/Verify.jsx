import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const Verify = ({ headerLevel, primaryButtonHandler, serviceDescription }) => {
  const content = {
    heading: `Please verify your identity to ${serviceDescription}`,
    headerLevel,
    alertText: (
      <>
        <p>
          We need to make sure you’re you — and not someone pretending to be you
          — before we can give you access to your personal and health-related
          information. This helps us keep your information safe and prevent
          fraud and identity theft.
        </p>
        <p>
          <strong>This one-time process takes about 5 to 10 minutes.</strong>
        </p>
      </>
    ),
    primaryButtonText: 'Verify your identity',
    primaryButtonHandler,
    status: 'warning',
  };

  return <CallToActionAlert {...content} />;
};

Verify.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
  headerLevel: PropTypes.string,
};

export default Verify;
