import React from 'react';
import PropTypes from 'prop-types';
import { LoginButton } from '~/platform/user/exportsFile';
import { maskEmail } from '../helpers';

export default function AccountSwitch({ hasLogingov, userEmail }) {
  const maskedEmail = maskEmail(userEmail);
  return (
    <div>
      <h2>
        Switch to your <strong>{hasLogingov ? 'Login.gov' : 'ID.me'}</strong>{' '}
        account now
      </h2>
      <p>
        We found an existing {hasLogingov ? 'Login.gov' : 'ID.me'} account for
        you associated with this email:
      </p>
      <p>
        <strong>{maskedEmail}</strong>
      </p>
      <LoginButton csp={hasLogingov ? 'logingov' : 'idme'} />
    </div>
  );
}

AccountSwitch.propTypes = {
  hasLogingov: PropTypes.bool,
  userEmail: PropTypes.string,
};
