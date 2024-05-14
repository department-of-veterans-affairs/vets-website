import React from 'react';
import PropTypes from 'prop-types';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';
import CallToActionAlert from '../CallToActionAlert';

const SignIn = ({
  serviceDescription,
  primaryButtonHandler,
  headerLevel,
  ariaLabel = null,
  ariaDescribedby = null,
}) => {
  const content = {
    heading: `Sign in to ${serviceDescription}`,
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
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.string,
};

export default SignIn;
