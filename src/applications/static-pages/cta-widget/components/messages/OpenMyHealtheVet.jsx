import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const OpenMyHealtheVet = ({
  serviceDescription,
  toolName,
  primaryButtonHandler,
}) => {
  const content = {
    heading: `My HealtheVet will open in a new tab where you can ${serviceDescription}`,
    alertText: (
      <p>
        You may need to sign in again on My HealtheVet to use the site’s{' '}
        {toolName} tool. If you do, sign in with the same account you used to
        sign in here on VA.gov. You also may need to disable your browser’s
        pop-up blocker so that My HealtheVet will be able to open.
      </p>
    ),
    primaryButtonText: 'Go to My HealtheVet',
    primaryButtonHandler,
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

OpenMyHealtheVet.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
  toolName: PropTypes.string,
};

export default OpenMyHealtheVet;
