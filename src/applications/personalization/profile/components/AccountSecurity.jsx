import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const AccountSecurity = () => {
  return (
    <Tier2PageContent pageHeader="Account security">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS}
        content="Manage third-party apps that have access to your VA.gov profile."
        href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SIGNIN_INFORMATION}
        content="Manage your sign-in information and complete account setup."
        href={PROFILE_PATHS.SIGNIN_INFORMATION}
        reactLink
      />
    </Tier2PageContent>
  );
};

AccountSecurity.propTypes = {};

export default AccountSecurity;
