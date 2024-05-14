import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSignInServiceProvider } from '../../../hooks';
import { SignInEmailAlert } from '../../alerts/CredentialRetirementAlerts';
import { selectShowCredRetirementMessaging } from '../../../selectors';

const SignInServiceUpdateLink = ({ isIdentityVerified }) => {
  const { link, label } = useSignInServiceProvider();

  const showCredRetirementMessaging = useSelector(
    selectShowCredRetirementMessaging,
  );

  return (
    <>
      {showCredRetirementMessaging &&
        isIdentityVerified && <SignInEmailAlert />}

      <p className="vads-u-margin--0">
        To access or update your sign-in information, go to the website where
        you manage your account information. Any updates you make there will
        automatically update on VA.gov.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {`Update your sign-in information on the ${label} website`}
        </a>
      </p>
    </>
  );
};

// this prop will be removed once MHV and DS Logon are fully retired
SignInServiceUpdateLink.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
};

export default SignInServiceUpdateLink;
