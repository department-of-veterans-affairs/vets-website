import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { mfa } from '~/platform/user/authentication/utilities';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';

import SignInServiceUpdateLink from '../contact-information/email-addresses/SignInServiceUpdateLink';
import { ConditionalProcessList as List } from './ConditionalProcessList';
import { ProfileInfoCard } from '../ProfileInfoCard';

const mfaHandler = () => {
  recordEvent({ event: AUTH_EVENTS.MFA });
  mfa();
};

const AccountSetupList = ({ isIdentityVerified, isMultifactorEnabled }) => {
  return (
    <List>
      <List.Item complete={isIdentityVerified}>
        <List.HeadingComplete>Verify your identity</List.HeadingComplete>

        <List.ContentComplete>
          We’ve verified your identity.
        </List.ContentComplete>

        <List.HeadingIncomplete>
          <a href="/verify">Verify your identity</a>
        </List.HeadingIncomplete>

        <List.ContentIncomplete>
          Verify your identity to access your complete profile.
        </List.ContentIncomplete>
      </List.Item>

      <List.Item complete={isMultifactorEnabled}>
        <List.HeadingComplete>
          Add multifactor authentication
        </List.HeadingComplete>

        <List.ContentComplete>
          You’ve added an extra layer of security to your account with 2-factor
          authentication.
        </List.ContentComplete>

        <List.HeadingIncomplete>
          <button
            onClick={mfaHandler}
            className="va-button-link vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--h4"
            type="button"
          >
            Add multifactor authentication
          </button>
        </List.HeadingIncomplete>

        <List.ContentIncomplete>
          Add an extra layer of protection called multifactor authentication (or
          2-factor authentication). This helps to make sure only you can access
          your account—even if someone gets your password.
        </List.ContentIncomplete>
      </List.Item>
    </List>
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
      <ProfileInfoCard
        title="Sign-in information"
        level={2}
        data={
          <SignInServiceUpdateLink isIdentityVerified={isIdentityVerified} />
        }
        className="vads-u-margin-bottom--2"
      />

      <ProfileInfoCard level={2} title="Account setup" data={data} />
    </>
  );
};

AccountSecurityTables.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
};
