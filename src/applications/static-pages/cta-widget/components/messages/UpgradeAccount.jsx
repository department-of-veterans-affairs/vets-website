import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const UpgradeAccount = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `You’ll need to upgrade your My HealtheVet account to ${serviceDescription}`,
    alertText: (
      <p>It’ll only take us a minute to do this for you, and it’s free.</p>
    ),
    primaryButtonText: 'Upgrade your My HealtheVet account',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

UpgradeAccount.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default UpgradeAccount;
