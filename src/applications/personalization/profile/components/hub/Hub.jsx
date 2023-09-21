import React from 'react';

import { PROFILE_PATHS } from '../../constants';

import { ProfileBreadcrumbs } from '../ProfileBreadcrumbs';
import { HubCard } from './HubCard';
import { ProfileLink } from '../ProfileLink';

export const Hub = () => {
  return (
    <>
      <ProfileBreadcrumbs className="vads-u-margin-left--neg1 vads-u-margin-top--neg2" />

      <div className="vads-l-row">
        <h1 className="vads-u-padding-bottom--3">Profile</h1>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="vads-u-padding-right--4"
          heading="Personal information"
          content="Review your legal name, date of birth, and disability rating. And
              manage your preferred name and gender identity."
        >
          <div className="vads-u-margin-bottom--0p5">
            <ProfileLink
              text="Manage your personal information"
              href={PROFILE_PATHS.PERSONAL_INFORMATION}
            />
          </div>
        </HubCard>

        <HubCard
          heading="Contact information"
          content="Manage your addresses, phone numbers, and contact email address."
        >
          <div className="vads-u-margin-bottom--0p5">
            <ProfileLink
              text="Manage your contact information"
              href={PROFILE_PATHS.CONTACT_INFORMATION}
            />
          </div>
        </HubCard>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="vads-u-padding-right--4"
          heading="Military information"
          content="Review your military branches and dates of service."
        >
          <>
            <div className="vads-u-display--block">
              <ProfileLink
                text="Review your military information"
                href={PROFILE_PATHS.MILITARY_INFORMATION}
              />
            </div>
            <div className="vads-u-display--block vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
              <ProfileLink
                text="Learn how to request your DD214 and other military records"
                href="/records/get-military-service-records/"
              />
            </div>
          </>
        </HubCard>

        <HubCard
          heading="Direct deposit information"
          content="Manage direct deposit information for disability compensation, pension, and education benefits."
        >
          <div className="vads-u-display--block vads-u-margin-bottom--5">
            <ProfileLink
              text="Manage your direct deposit information"
              href={PROFILE_PATHS.DIRECT_DEPOSIT}
            />
          </div>
        </HubCard>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="vads-u-padding-right--4"
          heading="Notification settings"
          content="Manage the text and email notifications you get from VA."
        >
          <div className="vads-u-margin-bottom--5">
            <ProfileLink
              text="Manage notification settings"
              href={PROFILE_PATHS.NOTIFICATION_SETTINGS}
            />
          </div>
        </HubCard>

        <HubCard
          heading="Account security"
          content="Review your sign-in information and account setup."
        >
          <>
            <div className="vads-u-display--block">
              <ProfileLink
                text="Review account security"
                href={PROFILE_PATHS.ACCOUNT_SECURITY}
              />
            </div>

            <div className="vads-u-display--block vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
              <ProfileLink
                text="Update your sign-in info on the [credential] website"
                href="/coming-soon-cred-url"
              />
            </div>
          </>
        </HubCard>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--4 ">
        <HubCard
          className="vads-u-padding-right--4"
          heading="Connected apps"
          content="Manage the 3rd-party apps that have access to your VA.gov profile."
        >
          <div className="vads-u-display--block vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
            <ProfileLink
              href={PROFILE_PATHS.CONNECTED_APPLICATIONS}
              text="Manage connected apps"
            />
          </div>
        </HubCard>
      </div>
    </>
  );
};
