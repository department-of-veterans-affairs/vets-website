import React from 'react';
import PropTypes from 'prop-types';

const EmailAddressNotification = ({ signInServiceName }) => {
  let link;
  let buttonText;

  if (signInServiceName === 'idme') {
    link = 'https://wallet.id.me/settings';
    buttonText = 'ID.me';
  }

  if (signInServiceName === 'dslogon') {
    link = 'https://myaccess.dmdc.osd.mil/identitymanagement';
    buttonText = 'DS Logon';
  }

  if (signInServiceName === 'mhv') {
    link = 'https://www.myhealth.va.gov';
    buttonText = 'My HealtheVet';
  }

  return (
    <>
      <p className="vads-u-margin--0">
        To view or update your sign in email, go to the website where you manage
        your account information. Any email updates you make there will
        automatically update on VA.gov.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Update sign in email address on {buttonText}
        </a>
      </p>
    </>
  );
};

EmailAddressNotification.propTypes = {
  signInServiceName: PropTypes.string.isRequired,
};

export default EmailAddressNotification;
