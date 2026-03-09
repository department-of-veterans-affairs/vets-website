import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';
import CreateAccountLink from '~/platform/user/authentication/components/CreateAccountLink';
import VerifyAccountLink from '~/platform/user/authentication/components/VerifyAccountLink';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import { CREDENTIAL_DEADLINES } from '../../../constants';

const CredentialRetirementMessaging = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const showCredentialRetirementMessaging = useToggleValue(
    TOGGLE_NAMES.profileShowCredentialRetirementMessaging,
  );
  const signInService = useSelector(signInServiceName);
  const serviceLabel = SERVICE_PROVIDERS?.[signInService]?.label;
  const serviceLabelFormatted = serviceLabel ? ` ${serviceLabel}` : '';
  return showCredentialRetirementMessaging ? (
    <>
      Starting {CREDENTIAL_DEADLINES[serviceLabel]}, you’ll no longer be able to
      sign in with your
      {serviceLabelFormatted} username and password.
    </>
  ) : null;
};

export default function VerifyIdentity({ useOAuth }) {
  const { ID_ME, LOGIN_GOV } = CSP_IDS;

  return (
    <va-alert status="continue" visible uswds>
      <h2 slot="headline" data-testid="direct-deposit-mfa-message">
        Verify your identity with Login.gov or ID.me to change your direct
        deposit information online
      </h2>
      <p>
        Before we give you access to change your direct deposit information, we
        need to make sure you’re you—and not someone pretending to be you. This
        helps us protect your bank account and prevent fraud.
      </p>
      <p>
        <strong>If you have a verified Login.gov or ID.me account</strong>, sign
        out now. Then sign back in with that account to continue.
      </p>
      <p>
        <strong>If you don’t have one of these accounts</strong>, you can create
        one and verify your identity now. <CredentialRetirementMessaging />
      </p>
      {[ID_ME, LOGIN_GOV].map(policy => (
        <p key={policy}>
          {useOAuth ? (
            <CreateAccountLink policy={policy} useOAuth={useOAuth} />
          ) : (
            <VerifyAccountLink policy={policy} useOAuth={useOAuth} />
          )}
        </p>
      ))}
      <p>
        <strong>Note:</strong> If you need help updating your direct deposit
        information, call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-alert>
  );
}

VerifyIdentity.propTypes = {
  useOAuth: PropTypes.bool.isRequired,
};
