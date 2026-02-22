import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { mfa } from '~/platform/user/authentication/utilities';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import SignInServiceUpdateLink from '../contact-information/email-addresses/SignInServiceUpdateLink';
import { ProfileInfoSection } from '../ProfileInfoSection';
import { useSignInServiceProvider } from '../../hooks';

const mfaHandler = ial2Enforcement => () => {
  recordEvent({ event: AUTH_EVENTS.MFA });
  mfa(undefined, ial2Enforcement);
};

const AccountSetupList = ({ isIdentityVerified, isMultifactorEnabled }) => {
  const { label } = useSignInServiceProvider();
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  return (
    <va-process-list>
      <va-process-list-item
        active={!isIdentityVerified}
        checkmark={isIdentityVerified}
        header="Verify your identity"
      >
        {isIdentityVerified ? (
          <p>We’ve verified your identity.</p>
        ) : (
          <>
            <p>
              We’ll need to verify your identity so that you can securely access
              your complete profile.
            </p>
            <a href="/verify">Verify your identity</a>
          </>
        )}
      </va-process-list-item>
      <va-process-list-item
        active={!isMultifactorEnabled}
        checkmark={isMultifactorEnabled}
        header="Add multifactor authentication"
      >
        {isMultifactorEnabled ? (
          <p>
            You’ve added an extra layer of security to your account with
            2-factor authentication.
          </p>
        ) : (
          <>
            <p>
              Add an extra layer of protection called multifactor authentication
              (or 2-factor authentication). This helps to make sure only you can
              access your account—even if someone gets your password.
            </p>
            <va-button
              onClick={mfaHandler(ial2Enforcement)}
              text={`Sign in again through ${label} to get started`}
            />
          </>
        )}
      </va-process-list-item>
    </va-process-list>
  );
};

AccountSetupList.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
};

export const AccountSecurityTables = ({
  isIdentityVerified,
  isMultifactorEnabled,
}) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profile2Enabled = useToggleValue(TOGGLE_NAMES.profile2Enabled);

  const data = (
    <AccountSetupList
      {...{
        isIdentityVerified,
        isMultifactorEnabled,
      }}
    />
  );

  return (
    <>
      {!profile2Enabled && (
        <ProfileInfoSection
          title="Sign-in information"
          level={2}
          data={
            <SignInServiceUpdateLink isIdentityVerified={isIdentityVerified} />
          }
          className="vads-u-margin-bottom--2"
        />
      )}

      {profile2Enabled && (
        <SignInServiceUpdateLink isIdentityVerified={isIdentityVerified} />
      )}

      <ProfileInfoSection level={2} title="Account setup" data={data} />
    </>
  );
};

AccountSecurityTables.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
};
