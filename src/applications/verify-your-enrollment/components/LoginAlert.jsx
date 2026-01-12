import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import VerifyAccountLink from '~/platform/user/authentication/components/VerifyAccountLink';
import { CSP_IDS } from 'platform/user/authentication/constants';

const LoginAlert = () => {
  const { ID_ME, LOGIN_GOV } = CSP_IDS;
  const heading = `Verify your identity with ID.me or Login.gov to change your direct deposit information online`;
  return (
    <VaAlert status="continue" visible uswds>
      <h2 slot="headline">{heading}</h2>
      <>
        <p data-testid="direct-deposit-mfa-message">
          Before we give you access to change your direct deposit information,
          we need to make sure you’re you—and not someone pretending to be you.
          This helps us protect your bank account and prevent fraud.
        </p>
        <p>
          <strong>If you have a verified ID.me or Login.gov account</strong>,
          sign out now. Then sign back in with that account to continue.
        </p>
        <p>
          <strong>If you don’t have one of these accounts</strong>, you can
          create one and verify your identity now.
        </p>
        {[ID_ME, LOGIN_GOV].map(policy => (
          <p key={policy}>
            <VerifyAccountLink policy={policy} />
          </p>
        ))}
        <p>
          <strong>Note:</strong> If you need help updating your direct deposit
          information, call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711">TTY : 711</va-telephone>
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </>
    </VaAlert>
  );
};

export default LoginAlert;
