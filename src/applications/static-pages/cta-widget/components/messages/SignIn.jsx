import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

const SignIn = ({
  serviceDescription,
  primaryButtonHandler,
  headerLevel,
  ariaLabel = null,
  ariaDescribedby = null,
}) => {
  const content = {
    heading: `Please sign in to ${serviceDescription}`,
    headerLevel,
    alertText: (
      <p>
        Sign in with your existing <ServiceProvidersText isBold /> account.{' '}
        <ServiceProvidersTextCreateAcct />
      </p>
    ),
    primaryButtonText: 'Sign in or create an account',
    primaryButtonHandler,
    status: 'continue',
    ariaLabel,
    ariaDescribedby,
  };

  return <CallToActionAlert {...content} />;
};

SignIn.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
  headerLevel: PropTypes.number,
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.string,
};

export default SignIn;
