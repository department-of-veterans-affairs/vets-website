import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { mfa } from 'platform/user/authentication/utilities';
import Verified from './Verified';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

const TwoFactorAuthorizationStatus = ({ isMultifactorEnabled }) => {
  if (isMultifactorEnabled) {
    return (
      <Verified>
        You’ve added an extra layer of security to your account with 2-factor
        authentication.
      </Verified>
    );
  }

  const mfaHandler = () => {
    recordEvent({ event: AUTH_EVENTS.MFA });
    mfa();
  };

  return (
    <>
      <p className="vads-u-margin--0">
        Add an extra layer of security (called 2-factor authentication). This
        helps to make sure only you can access your account - even if someone
        gets your password.
      </p>
      <p className="vads-u-margin-bottom--0">
        <button className="va-button-link" onClick={() => mfaHandler()}>
          Set up 2-factor authentication
        </button>
      </p>
    </>
  );
};

TwoFactorAuthorizationStatus.propTypes = {
  isMultifactorEnabled: PropTypes.bool.isRequired,
};

export default TwoFactorAuthorizationStatus;
