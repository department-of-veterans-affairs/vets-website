import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  fetchSharingStatus,
  updateSharingStatus,
  clearSharingStatus,
} from '../actions/sharing';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { updatePageTitle } from '../../shared/util/helpers';
import { pageTitles } from '../util/constants';

const SettingsPage = () => {
  const dispatch = useDispatch();

  const fullState = useSelector(state => state);
  const isSharing = useSelector(state => state.mr.sharing.isSharing);
  const statusError = useSelector(state => state.mr.sharing.statusError);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.SETTINGS_PAGE_TITLE);
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(fetchSharingStatus());
    },
    [dispatch],
  );

  const handleUpdateSharing = currentOptInStatus => {
    dispatch(clearSharingStatus()).then(() => {
      dispatch(updateSharingStatus(!currentOptInStatus)).then(() => {
        setShowSuccessAlert(true);
      });
    });
  };

  const sharingCardContent = () => {
    if (statusError) {
      if (['optin', 'optout'].includes(statusError.type)) {
        const optInError = statusError.type === 'optin';
        return (
          <va-alert
            close-btn-aria-label="Close notification"
            status="error"
            visible
          >
            <h3 className="vads-u-margin-top--0">
              You can’t {optInError ? 'opt back in' : 'opt out'} right now
            </h3>
            <p>
              We’re sorry. Something went wrong in our system. Try again later.
            </p>
            <p>
              You can also {optInError ? 'opt in to' : 'opt out of'} sharing
              your records by submitting a form to your VA health facility.
            </p>
            <p>
              <a href="/my-health/medical-records/settings">
                Learn how to opt {optInError ? 'in' : 'out'} using a form
              </a>
            </p>
          </va-alert>
        );
      }
      return (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h3 className="vads-u-margin-top--0">
            We can’t access your sharing setting right now
          </h3>
          <p>
            We’re sorry. Something went wrong in our system. Try again later.
          </p>
          <p>
            If you’re still having trouble, call your VA health facility and ask
            for the medical records office.
          </p>
          <p>
            <a href="/find-locations/?facilityType=health">
              Find your VA health facility
            </a>
          </p>
        </va-alert>
      );
    }
    if (isSharing === undefined) {
      return (
        <va-card background className="vads-u-padding--3">
          <va-loading-indicator
            message="Loading..."
            class="vads-u-margin--4"
            data-testid="sharing-status-loading-indicator"
          />
        </va-card>
      );
    }
    return (
      <va-card background className="vads-u-padding--3">
        <h3 className="vads-u-margin-top--0">
          Your sharing setting: {isSharing ? 'Opted in' : 'Opted out'}
        </h3>
        <va-alert
          background-only
          class="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          status="success"
          visible={showSuccessAlert}
        >
          <p className="vads-u-margin-y--0">
            You’ve opted {isSharing ? 'back in to' : 'out of'} sharing
          </p>
        </va-alert>
        {isSharing ? (
          <p>
            We automatically include you in this online sharing program. You can
            opt out (ask us not to share your records) at any time.
          </p>
        ) : (
          <p>
            We’re not currently sharing your records online with your community
            care providers. If you want us to start sharing your records, you
            can opt back in.
          </p>
        )}
        <va-button
          text={isSharing ? 'Opt out' : 'Opt back in'}
          onClick={() =>
            // setShareStatus(formSelection);
            // setOptedIn(!isSharing);
            handleUpdateSharing(isSharing)
          }
        />
      </va-card>
    );
  };

  return (
    <div className="settings vads-u-margin-bottom--5">
      <section>
        <h1>Medical records settings</h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 va-introtext">
          Review and update your medical records sharing and notification
          settings.
        </p>
      </section>
      <section>
        <h2>Manage your sharing settings</h2>
        <p>
          The Veterans Health Information Exchange program is a secure online
          system that gives participating community care providers instant
          access to your VA medical records.
        </p>
        <p>
          We share your records with your providers only when they’re treating
          you. Ask your community care providers if they participate in this
          program.
        </p>
        <h3>What we share through this program:</h3>
        <ul>
          <li>
            All allergies, vaccines, medications, and health conditions in your
            VA medical records
          </li>
          <li>
            Recent lab and test results, vitals, and care summaries and notes
            from VA providers
          </li>
          <li>List of your past and future appointments with VA providers</li>
          <li>
            Other information your providers may need, such as your emergency
            contacts
          </li>
        </ul>
        {sharingCardContent()}
      </section>
      <section>
        <h2>Manage notification settings</h2>
        <p>
          You can sign up to get email notifications when you have new lab and
          test results or images available. You can also opt out of email
          notifications at any time.
        </p>
        <p>
          To review or update your notification settings, go to your profile
          page on the My HealtheVet website.
        </p>
        <p>
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
          >
            Go to your profile on the My Healthevet website
          </a>
        </p>
      </section>
    </div>
  );
};

export default SettingsPage;
