import React from 'react';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';

const ChangeAddress = () => {
  // const content = {
  //   heading: `Go to your VA.gov profile to ${serviceDescription}`,
  //   alertText: (
  //     <p>
  //       You’ll find your mailing and home address in your profile’s{' '}
  //       <strong>Contact information</strong> section.
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

ChangeAddress.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
};

export default ChangeAddress;
