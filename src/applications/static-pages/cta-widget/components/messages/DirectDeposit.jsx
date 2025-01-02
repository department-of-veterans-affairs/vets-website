import React from 'react';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';

const DirectDeposit = () => {
  // const content = {
  //   heading: `Go to your VA.gov profile to ${serviceDescription}`,
  //   alertText: (
  //     <p>
  //       Here, you can edit your bank name as well as your account number and
  //       type.
  //     </p>
  //   ),
  //   primaryButtonText: 'Go to your VA.gov profile',
  //   primaryButtonHandler,
  //   status: 'continue',
  // };

  return (
    <VaAlertSignIn variant="signInRequired" visible>
      <span slot="SignInButton">
        <VerifyButton csp="logingov" />
        <VerifyButton csp="idme" />
      </span>
    </VaAlertSignIn>
  );
};

DirectDeposit.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
};

export default DirectDeposit;
