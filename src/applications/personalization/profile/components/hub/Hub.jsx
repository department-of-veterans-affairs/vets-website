import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectProfileContactsToggle } from '@@profile/selectors';

import { hasBadAddress as hasBadAddressSelector } from '@@vap-svc/selectors';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';
import { useSignInServiceProvider } from '@@profile/hooks';

import { ProfileBreadcrumbs } from '@@profile/components/ProfileBreadcrumbs';
import { ProfileLink } from '@@profile/components/ProfileLink';
import BadAddressAlert from '@@profile/components/alerts/bad-address/ProfileAlert';
import { HubCard } from './HubCard';
import { EduMigrationAlert } from '../direct-deposit/alerts/EduMigrationAlert';

export const Hub = () => {
  const { label, link } = useSignInServiceProvider();
  const hasBadAddress = useSelector(hasBadAddressSelector);
  const profileContactsEnabled = useSelector(selectProfileContactsToggle);

  useEffect(() => {
    document.title = `Profile | Veterans Affairs`;
  }, []);

  return (
    <>
      <ProfileBreadcrumbs className="medium-screen:vads-u-padding-left--1 medium-screen:vads-u-margin-left--neg1 medium-screen:vads-u-margin-top--neg2 vads-u-margin-bottom--neg1" />

      {/* ROW */}
      <div className="vads-l-row">
        <h1>Profile</h1>
      </div>

      <EduMigrationAlert className="vads-u-margin-top--0 vads-u-margin-bottom--4 vads-l-col--10" />

      {hasBadAddress && (
        <BadAddressAlert className="vads-u-margin-top--0 vads-u-margin-bottom--4 vads-l-col--10" />
      )}

      {/* ROW */}
      <div className="hub-cards vads-u-margin-bottom--4">
        <HubCard
          heading={PROFILE_PATH_NAMES.PERSONAL_INFORMATION}
          content="Legal name, date of birth, preferred name, gender identity, and disability rating"
        >
          <ProfileLink
            text="Manage your personal information"
            href={PROFILE_PATHS.PERSONAL_INFORMATION}
          />
        </HubCard>

        <HubCard
          heading={PROFILE_PATH_NAMES.CONTACT_INFORMATION}
          content="Addresses, phone numbers, and email address"
        >
          <ProfileLink
            text="Manage your contact information"
            href={PROFILE_PATHS.CONTACT_INFORMATION}
          />
        </HubCard>

        {profileContactsEnabled && (
          <HubCard
            heading={PROFILE_PATH_NAMES.CONTACTS}
            content="Medical emergency contact and next of kin contact information"
          >
            <ProfileLink
              className="small-screen--line-break-at-32-characters"
              text="Review your personal health care contacts"
              href={PROFILE_PATHS.CONTACTS}
            />
          </HubCard>
        )}

        <HubCard
          heading={PROFILE_PATH_NAMES.MILITARY_INFORMATION}
          content="Military branches and dates of service"
        >
          <>
            <ProfileLink
              className="vads-u-display--block vads-u-margin-bottom--2"
              text="Review your military information"
              href={PROFILE_PATHS.MILITARY_INFORMATION}
            />
            <ProfileLink
              className="medium-screen--line-break-at-40-characters"
              text="Learn how to request your DD214 and other military records"
              href="/records/get-military-service-records/"
            />
          </>
        </HubCard>

        <HubCard
          heading={PROFILE_PATH_NAMES.DIRECT_DEPOSIT}
          content="Direct deposit information for disability compensation, pension, and education benefits"
        >
          <ProfileLink
            className="vads-u-display--block vads-u-margin-bottom--2"
            text="Manage your direct deposit information"
            href={PROFILE_PATHS.DIRECT_DEPOSIT}
          />

          <ProfileLink
            text="View payment history"
            href="/va-payment-history/payments/"
          />
        </HubCard>

        <HubCard
          heading={PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}
          content="Text and email notifications you get from VA"
        >
          <ProfileLink
            text="Manage notification settings"
            href={PROFILE_PATHS.NOTIFICATION_SETTINGS}
          />
        </HubCard>

        <HubCard
          heading={PROFILE_PATH_NAMES.ACCOUNT_SECURITY}
          content="Sign-in and account information"
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
          heading={PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS}
          content="3rd-party apps that have access to your VA.gov profile"
        >
          <ProfileLink
            href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
            text="Manage connected apps"
          />
        </HubCard>
      </div>
    </>
  );
};
