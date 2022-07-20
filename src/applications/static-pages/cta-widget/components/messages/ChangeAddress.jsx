import React from 'react';
import PropTypes from 'prop-types';

import CallToActionAlert from '../CallToActionAlert';

const ChangeAddress = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `Go to your VA.gov profile to ${serviceDescription}`,
    alertText: (
      <p>
        You’ll find your mailing and home address in your profile’s{' '}
        <strong>Contact information</strong> section.
      </p>
    ),
    primaryButtonText: 'Go to your VA.gov profile',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

ChangeAddress.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
};

export default ChangeAddress;
