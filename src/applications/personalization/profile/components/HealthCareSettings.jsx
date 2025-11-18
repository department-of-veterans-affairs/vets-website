import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const HealthCareSettings = () => {
  return (
    <Tier2PageContent pageHeader="Health care settings">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.HEALTH_CARE_CONTACTS}
        content="Review medical emergency contact and next of kin contact information"
        href={PROFILE_PATHS.HEALTH_CARE_CONTACTS}
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
        content="Manage your scheduling preferences for health care appointments"
        href={PROFILE_PATHS.SCHEDULING_PREFERENCES}
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SECURE_MESSAGES_SIGNATURE}
        content="Manage your secure messages signature"
        href={PROFILE_PATHS.SECURE_MESSAGES_SIGNATURE}
      />
      <va-card background>
        <h3 slot="headline">Looking for your full health care information?</h3>
        <p>
          Visit the <va-link href="/my-health/" text="My HealtheVet" /> page for
          all your health care needs.
        </p>
      </va-card>
    </Tier2PageContent>
  );
};

HealthCareSettings.propTypes = {};

export default HealthCareSettings;
