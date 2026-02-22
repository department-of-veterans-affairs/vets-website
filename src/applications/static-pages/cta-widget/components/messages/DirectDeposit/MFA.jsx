import React, { useCallback } from 'react';
import { verify } from 'platform/user/authentication/utilities';
import { CSP_IDS } from 'platform/user/authentication/constants';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import CallToActionAlert from '../../CallToActionAlert';

const MFA = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  const verifyLink = useCallback(
    async policy => {
      await verify({ policy, isLink: true, isSignup: false, ial2Enforcement });
    },
    [ial2Enforcement],
  );

  const content = {
    heading: `Verify your identity with Login.gov or ID.me to change your direct deposit information online`,
    alertText: (
      <>
        <p data-testid="direct-deposit-mfa-message">
          Before we give you access to change your direct deposit information,
          we need to make sure you’re you—and not someone pretending to be you.
          This helps us protect your bank account and prevent fraud.
        </p>
        <p>
          <strong>If you have a verified Login.gov or ID.me account</strong>,
          sign out now. Then sign back in with that account to continue.
        </p>
        <p>
          <strong>If you don’t have one of these accounts</strong>, you can
          create one and verify your identity now.
        </p>
        <p>
          <a
            href={verifyLink(CSP_IDS.LOGIN_GOV)}
            data-testid="direct-deposit-login-gov-sign-up-link"
          >
            Create a Login.gov account
          </a>
        </p>
        <p>
          <a
            href={verifyLink(CSP_IDS.ID_ME)}
            data-testid="direct-deposit-id-me-sign-up-link"
          >
            Create an ID.me account
          </a>
        </p>
        <p>
          <strong>Note:</strong> If you need help updating your direct deposit
          information, call us at <va-telephone contact="8008271000" />
          <va-telephone contact="711">TTY : 711</va-telephone>. We’re here
          Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </>
    ),
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

export default MFA;
