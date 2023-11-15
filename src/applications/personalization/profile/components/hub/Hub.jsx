import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  hasBadAddress as hasBadAddressSelector,
  selectProfileContactsToggle,
  selectProfileShowProofOfVeteranStatusToggle,
} from '@@profile/selectors';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';
import { useSignInServiceProvider } from '@@profile/hooks';

import { ProfileBreadcrumbs } from '@@profile/components/ProfileBreadcrumbs';
import { ProfileLink } from '@@profile/components/ProfileLink';
import BadAddressAlert from '@@profile/components/alerts/bad-address/ProfileAlert';
import { HubCard } from './HubCard';

export const Hub = () => {
  const { label, link } = useSignInServiceProvider();
  const hasBadAddress = useSelector(hasBadAddressSelector);
  const profileContactsEnabled = useSelector(selectProfileContactsToggle);
  const profileShowProofOfVeteranStatus = useSelector(
    selectProfileShowProofOfVeteranStatusToggle,
  );

  useEffect(() => {
    document.title = `Profile | Veterans Affairs`;
  }, []);

  return (
    <>
      <ProfileBreadcrumbs className="medium-screen:vads-u-margin-left--neg1 medium-screen:vads-u-margin-top--neg2 vads-u-margin-bottom--neg1" />

      {/* ROW */}
      <div className="vads-l-row">
        <h1 className="vads-u-padding-bottom--3">Profile</h1>
      </div>

      {hasBadAddress && (
        <BadAddressAlert className="vads-u-margin-top--0 vads-u-margin-bottom--4" />
      )}

      {/* ROW */}
      <div className="hub-cards vads-u-margin-bottom--4">
        <HubCard
          heading="Personal information"
          content="Review your legal name, date of birth, and disability rating. And
              manage your preferred name and gender identity."
        >
          <ProfileLink
            text="Manage your personal information"
            href={PROFILE_PATHS.PERSONAL_INFORMATION}
          />
        </HubCard>

        <HubCard
          heading="Contact information"
          content="Manage your addresses, phone numbers, and the email address we'll use to contact you."
        >
          <ProfileLink
            text="Manage your contact information"
            href={PROFILE_PATHS.CONTACT_INFORMATION}
          />
        </HubCard>

        {profileContactsEnabled && (
          <HubCard
            heading={PROFILE_PATH_NAMES.CONTACTS}
            content="Review your medical emergency contact and next of kin contact information."
          >
            <ProfileLink
              className="small-screen--line-break-at-32-characters"
              text="Review your personal health care contacts"
              href={PROFILE_PATHS.CONTACTS}
            />
          </HubCard>
        )}

        <HubCard
          heading="Military information"
          content="Review your military branches and dates of service."
        >
          <>
            <ProfileLink
              className="vads-u-display--block vads-u-margin-bottom--2"
              text="Review your military information"
              href={PROFILE_PATHS.MILITARY_INFORMATION}
            />
            <ProfileLink
              className="medium-screen--line-break-at-50-characters"
              text="Learn how to request your DD214 and other military records"
              href="/records/get-military-service-records/"
            />
          </>
        </HubCard>

        <HubCard
          heading="Direct deposit information"
          content="Manage direct deposit information for disability compensation, pension, and education benefits."
        >
          <ProfileLink
            text="Manage your direct deposit information"
            href={PROFILE_PATHS.DIRECT_DEPOSIT}
          />
        </HubCard>

        <HubCard
          heading="Notification settings"
          content="Manage the text and email notifications you get from VA."
        >
          <ProfileLink
            text="Manage notification settings"
            href={PROFILE_PATHS.NOTIFICATION_SETTINGS}
          />
        </HubCard>

        <HubCard
          heading="Account security"
          content="Review your sign-in and account information."
        >
          <>
            <ProfileLink
              className="vads-u-display--block vads-u-margin-bottom--2"
              text="Review account security"
              href={PROFILE_PATHS.ACCOUNT_SECURITY}
            />

            <ProfileLink
              className="vads-u-display--block"
              text={`Update your sign-in info on the ${label} website`}
              href={link}
            />
          </>
        </HubCard>

        <HubCard
          heading="Connected apps"
          content="Manage the 3rd-party apps that have access to your VA.gov profile."
        >
          <ProfileLink
            href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
            text="Manage connected apps"
          />
        </HubCard>
      </div>
      {/* Temporary link to proof of veteran status page for toggle testing  */}
      {profileShowProofOfVeteranStatus && (
        <ProfileLink
          href={PROFILE_PATHS.VETERAN_STATUS}
          text="View proof of Veteran status"
        />
      )}
    </>
  );
};
