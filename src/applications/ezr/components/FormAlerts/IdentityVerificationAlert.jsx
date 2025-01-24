import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from 'platform/user/authentication/components/VerifyAlert';

export const IdentityVerificationAlert = () => (
  <VerifyAlert headingLevel={3} dataTestId="ezr-identity-alert" />
);

IdentityVerificationAlert.propTypes = {
  onVerify: PropTypes.func,
};

export default IdentityVerificationAlert;
