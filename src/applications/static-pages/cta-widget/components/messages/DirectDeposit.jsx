import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const DirectDeposit = ({ serviceDescription, primaryButtonHandler }) => {
  const content = {
    heading: `Go to your VA.gov profile to ${serviceDescription}`,
    alertText: (
      <p>
        Here, you can edit your bank name as well as your account number and
        type.
      </p>
    ),
    primaryButtonText: 'Go to your VA.gov profile',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

DirectDeposit.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default DirectDeposit;
