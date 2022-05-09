import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../../CallToActionAlert';

const MFA = ({ primaryButtonHandler }) => {
  const content = {
    heading: `Verify your identity with Login.gov or ID.me to change your direct deposit information online`,
    alertText: (
      <>
        <p data-testid="direct-deposit-mfa-message">
          Before we give you access to change your direct deposit information,
          we need to make sure you’re you—and not someone pretending to be you.
          This helps us protect your bank account and prevent fraud.
        </p>
        <p>
          <strong>If you have a verified Login.gov or ID.me account</strong>,
          sign out now. Then sign back in with that account to continue.
        </p>
        <p>
          <strong>If you don’t have one of these accounts</strong>, you can
          create one and verify your identity now.
        </p>
        <p>Create a Login.gov account</p>
        <p>Create an ID.me account</p>
        <p>
          <strong>Note:</strong> If you need help updating your direct deposit
          information, call us at <va-telephone contact="800-827-1000" />
          <va-telephone contact="711">TTY : 711</va-telephone>. We’re here
          Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </>
    ),
    primaryButtonText: 'Set up 2-factor authentication',
    primaryButtonHandler,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

MFA.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default MFA;
