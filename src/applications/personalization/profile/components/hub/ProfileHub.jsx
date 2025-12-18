import React from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';
import Tier2PageContent from '../Tier2PageContent';
import { ProfileHubItem } from './ProfileHubItem';
import NameTag from './NameTag';

const ProfileHub = () => {
  return (
    <Tier2PageContent pageHeader="Profile">
      <NameTag />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.PERSONAL_INFORMATION}
        content="Legal name, date of birth, preferred name, and disability rating"
        href={PROFILE_PATHS.PERSONAL_INFORMATION}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.CONTACT_INFORMATION}
        content="Addresses, emails, and phone numbers"
        href={PROFILE_PATHS.CONTACT_INFORMATION}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION}
        content="Military branches and periods of service"
        href={PROFILE_PATHS.SERVICE_HISTORY_INFORMATION}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.FINANCIAL_INFORMATION}
        content="Direct deposit information, payments, benefit overpayments, and copay bills"
        href={PROFILE_PATHS.FINANCIAL_INFORMATION}
        reactLink
      />
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileHealthCareSettingsPage}>
        <Toggler.Enabled>
          <Toggler
            toggleName={Toggler.TOGGLE_NAMES.profileHideHealthCareContacts}
          >
            <Toggler.Enabled>
              <ProfileHubItem
                heading={PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS}
                content="Messages signature and scheduling preferences"
                href={PROFILE_PATHS.HEALTH_CARE_SETTINGS}
                reactLink
              />
            </Toggler.Enabled>
            <Toggler.Disabled>
              <ProfileHubItem
                heading={PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS}
                content="Health care contacts, messages signature, and scheduling preferences"
                href={PROFILE_PATHS.HEALTH_CARE_SETTINGS}
                reactLink
              />
            </Toggler.Disabled>
          </Toggler>
        </Toggler.Enabled>
      </Toggler>
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS}
        content="Benefits dependents and accredited representative or VSO"
        href={PROFILE_PATHS.DEPENDENTS_AND_CONTACTS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS}
        content="VA benefit letters and documents and Veteran Status Card"
        href={PROFILE_PATHS.LETTERS_AND_DOCUMENTS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS}
        content="Preferences for receiving email and text notifications"
        href={PROFILE_PATHS.EMAIL_AND_TEXT_NOTIFICATIONS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.ACCOUNT_SECURITY}
        content="Sign-in information and connected apps"
        href={PROFILE_PATHS.ACCOUNT_SECURITY}
        reactLink
      />
    </Tier2PageContent>
  );
};

ProfileHub.propTypes = {};

export default ProfileHub;
