import React from 'react';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';

const SignIn = ({ headerLevel }) => {
  return (
    <VaAlertSignIn variant="signInRequired" visible headerLevel={headerLevel}>
      <span slot="SignInButton">
        <VerifyButton csp="logingov" />
        <VerifyButton csp="idme" />
      </span>
    </VaAlertSignIn>
  );
};

SignIn.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SignIn;
