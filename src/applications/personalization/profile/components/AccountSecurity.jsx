import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const AccountSecurity = () => {
  return (
    <Tier2PageContent pageHeader="Account security">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS}
        content="3rd-party apps that have access to your VA.gov profile"
        href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SIGNIN_INFORMATION}
        content="Sign-in and account information"
        href={PROFILE_PATHS.SIGNIN_INFORMATION}
      />
    </Tier2PageContent>
  );
};

AccountSecurity.propTypes = {};

export default AccountSecurity;
