import React from 'react';
import PropTypes from 'prop-types';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CSP_IDS } from 'platform/user/authentication/constants';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

/**
 * Alert to show a user that is not verified.
 * @property {string} signInService user's signin service name
 * @property {string} headerLevel optional heading level
 * @property {string} serviceDescription optional description of the service that requires verification
 */
const Verify = ({ signInService, headerLevel }) => {
  const { variant, spanSlot } =
    {
      logingov: {
        variant: 'verifyLoginGov',
        spanSlot: (
          <span slot="LoginGovVerifyButton">
            <VerifyLogingovButton />
          </span>
        ),
      },
      idme: {
        variant: 'verifyIdMe',
        spanSlot: (
          <span slot="IdMeVerifyButton">
            <VerifyIdmeButton />
          </span>
        ),
      },
    }[signInService] || {};

  return (
    <VaAlertSignIn variant={variant} visible headingLevel={headerLevel}>
      {spanSlot}
    </VaAlertSignIn>
  );
};

Verify.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  serviceDescription: PropTypes.string,
  signInService: PropTypes.oneOf([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]),
};

export default Verify;
