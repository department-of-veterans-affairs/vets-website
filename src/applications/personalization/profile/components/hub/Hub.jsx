import React, { useEffect } from 'react';

import { hasBadAddress as hasBadAddressSelector } from '@@profile/selectors';
import { useSelector } from 'react-redux';

import { PROFILE_PATHS } from '@@profile/constants';
import { useSignInServiceProvider } from '@@profile/hooks';

import { ProfileBreadcrumbs } from '@@profile/components/ProfileBreadcrumbs';
import { ProfileLink } from '@@profile/components/ProfileLink';
import BadAddressAlert from '@@profile/components/alerts/bad-address/ProfileAlert';
import { HubCard } from './HubCard';

export const Hub = () => {
  const { label, link } = useSignInServiceProvider();
  const hasBadAddress = useSelector(hasBadAddressSelector);

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
      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="medium-screen:vads-u-padding-right--4 vads-u-padding-bottom--4 medium-screen:vads-u-padding-bottom--0"
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
          content="Manage your addresses, phone numbers, and the email address we'll use to contact you."
        >
          <div className="vads-u-margin-bottom--0p5">
            <ProfileLink
              text="Manage your contact information"
              href={PROFILE_PATHS.CONTACT_INFORMATION}
            />
          </div>
        </HubCard>
      </div>

      {/* ROW */}
      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="medium-screen:vads-u-padding-right--4 vads-u-padding-bottom--4 medium-screen:vads-u-padding-bottom--0"
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
            <div className="vads-u-display--block vads-u-margin-top--1p5 vads-u-margin-bottom--0p5 vads-u-padding-right--2 medium-screen:vads-u-padding-right">
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

      {/* ROW */}
      <div className="vads-l-row vads-u-margin-bottom--4">
        <HubCard
          className="medium-screen:vads-u-padding-right--4 vads-u-padding-bottom--4 medium-screen:vads-u-padding-bottom--0"
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
          content="Review your sign-in and account information."
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
                text={`Update your sign-in info on the ${label} website`}
                href={link}
              />
            </div>
          </>
        </HubCard>
      </div>

      {/* ROW */}
      <div className="vads-l-row vads-u-margin-bottom--4 ">
        <HubCard
          className="medium-screen:vads-u-padding-right--4"
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
