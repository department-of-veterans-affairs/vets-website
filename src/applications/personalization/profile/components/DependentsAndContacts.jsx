import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const DependentsAndContacts = () => {
  return (
    <Tier2PageContent pageHeader="Dependents and contacts">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE}
        content="Review contact information for your current accredited attorney, claims agent, or Veterans Service Organization (VSO)."
        href={PROFILE_PATHS.ACCREDITED_REPRESENTATIVE}
        reactLink
      />
      <ProfileHubItem
        heading="Dependents on file"
        content="Review the dependents we have on file for your disability, pension, or DIC benefits. And learn how to add or remove dependents."
        href="/manage-dependents/view"
      />
    </Tier2PageContent>
  );
};

DependentsAndContacts.propTypes = {};

export default DependentsAndContacts;
