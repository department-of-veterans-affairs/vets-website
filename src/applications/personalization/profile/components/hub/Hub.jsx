import React from 'react';

import { PROFILE_PATHS } from '../../constants';

import { ProfileBreadcrumbs } from '../ProfileBreadcrumbs';
import { HubCard } from './HubCard';
import { ProfileLink } from '../ProfileLink';

export const Hub = () => {
  return (
    <>
      <ProfileBreadcrumbs />

      <div className="vads-l-grid-container">
        <h1>Profile</h1>
      </div>

      <div className="vads-l-grid-container">
        <div className="vads-l-row vads-u-margin-bottom--4">
          <HubCard
            className="vads-u-padding-right--3"
            heading="Personal information"
            content="Review your legal name, date of birth, and disability rating. And
              manage your preferred name and gender identity."
            Links={() => (
              <ProfileLink
                text="Manage your personal information"
                href={PROFILE_PATHS.PERSONAL_INFORMATION}
              />
            )}
          />

          <HubCard
            heading="Contact information"
            content="Manage your addresses, phone numbers, and contact email address."
            Links={() => (
              <ProfileLink
                text="Manage your contact information"
                href={PROFILE_PATHS.CONTACT_INFORMATION}
              />
            )}
          />
        </div>

        <div className="vads-l-row vads-u-margin-bottom--4">
          <HubCard
            className="vads-u-padding-right--3"
            heading="Military information"
            content="Review your military branches and dates of service."
            Links={() => (
              <>
                <div className="vads-u-display--block">
                  <ProfileLink
                    text="Review your military information"
                    href={PROFILE_PATHS.MILITARY_INFORMATION}
                  />
                </div>
                <div className="vads-u-display--block vads-u-margin-top--1p5">
                  <ProfileLink
                    text="Learn how to request your DD214 and other military records"
                    href="/records/get-military-service-records/"
                  />
                </div>
              </>
            )}
          />

          <HubCard
            heading="Direct deposit information"
            content="Manage direct deposit information for disability compensation, pension, and education benefits."
            Links={() => (
              <ProfileLink
                text="Manage your direct deposit"
                href={PROFILE_PATHS.DIRECT_DEPOSIT}
              />
            )}
          />
        </div>

        <div className="vads-l-row vads-u-margin-bottom--4">
          <HubCard
            className="vads-u-padding-right--3 vads-u-padding-bottom--2"
            heading="Notification settings"
            content="Manage the text and email notifications you get from VA."
            Links={() => (
              <ProfileLink
                text="Manage notification settings"
                href={PROFILE_PATHS.NOTIFICATION_SETTINGS}
              />
            )}
          />

          <HubCard
            heading="Account security"
            content="Review your sign-in information and account setup."
            Links={() => (
              <>
                <div className="vads-u-display--block">
                  <ProfileLink
                    text="Update your sign-in info on the [credential] website"
                    href="/coming-soon-cred-url"
                  />
                </div>

                <div className="vads-u-display--block vads-u-margin-top--1p5">
                  <ProfileLink
                    text="Manage your account security"
                    href={PROFILE_PATHS.ACCOUNT_SECURITY}
                  />
                </div>
              </>
            )}
          />
        </div>

        <div className="vads-l-row vads-u-margin-bottom--4 ">
          <HubCard
            className="vads-u-padding-right--3"
            heading="Connected apps"
            content="Manage the 3rd-party apps that have access to your VA.gov profile."
            Links={() => (
              <>
                <ProfileLink
                  href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
                  text="Manage your connected apps"
                />
              </>
            )}
          />
        </div>
      </div>
    </>
  );
};
