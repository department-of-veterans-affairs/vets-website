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
        content="Addresses, phone numbers, and email address"
        href={PROFILE_PATHS.CONTACT_INFORMATION}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION}
        content="Military branches and dates of service"
        href={PROFILE_PATHS.SERVICE_HISTORY_INFORMATION}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.FINANCIAL_INFORMATION}
        content="Manage your direct deposit information, payments, and debts"
        href={PROFILE_PATHS.FINANCIAL_INFORMATION}
        reactLink
      />
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileHealthCareSettingsPage}>
        <Toggler.Enabled>
          <ProfileHubItem
            heading={PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS}
            content="Settings for your VA health care experience, such as emergency contacts and scheduling preferences"
            href={PROFILE_PATHS.HEALTH_CARE_SETTINGS}
            reactLink
          />
        </Toggler.Enabled>
      </Toggler>
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.DEPENDENTS_AND_CONTACTS}
        content="Manage your benefits dependents and accredited representative or VSO"
        href={PROFILE_PATHS.DEPENDENTS_AND_CONTACTS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.LETTERS_AND_DOCUMENTS}
        content="Review your VA letters and documents, including your Veteran Status Card"
        href={PROFILE_PATHS.LETTERS_AND_DOCUMENTS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.EMAIL_AND_TEXT_NOTIFICATIONS}
        content="Manage your text and email notifications"
        href={PROFILE_PATHS.EMAIL_AND_TEXT_NOTIFICATIONS}
        reactLink
      />
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.ACCOUNT_SECURITY}
        content="Sign-in, account information, and connected apps"
        href={PROFILE_PATHS.ACCOUNT_SECURITY}
        reactLink
      />
    </Tier2PageContent>
  );
};

ProfileHub.propTypes = {};

export default ProfileHub;
