import React from 'react';
import PropTypes from 'prop-types';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';

const EmailAddressNotification = ({ signInServiceName }) => {
  const { link, label } = SERVICE_PROVIDERS[signInServiceName];

  return (
    <>
      <p className="vads-u-margin--0">
        To view or update your sign in information, go to the website where you
        manage your account information. Any updates you make there will
        automatically update on VA.gov.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Update sign-in information on {label}
        </a>
      </p>
    </>
  );
};

EmailAddressNotification.propTypes = {
  signInServiceName: PropTypes.string.isRequired,
};

export default EmailAddressNotification;
