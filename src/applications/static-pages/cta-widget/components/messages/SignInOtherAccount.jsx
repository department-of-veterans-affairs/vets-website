import React from 'react';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';

/**
 * Alert to show a user that has mhv basic account (is not verified).
 * @property {string} headerLevel optional heading level
 * @property {string} serviceDescription optional description of the service that requires verification
 */
const SignInOtherAccount = ({ headerLevel }) => {
  return (
    <VaAlertSignIn variant="signInEither" visible headingLevel={headerLevel}>
      <span slot="LoginGovSignInButton">
        <VerifyButton csp="logingov" />
      </span>
      <span slot="IdMeSignInButton">
        <VerifyButton csp="idme" />
      </span>
    </VaAlertSignIn>
  );
};

SignInOtherAccount.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  serviceDescription: PropTypes.string,
};

export default SignInOtherAccount;
