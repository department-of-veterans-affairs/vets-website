import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  fetchSharingStatus,
  updateSharingStatus,
  clearSharingStatus,
} from '../actions/sharing';
import { pageTitles } from '../util/constants';
import ExternalLink from '../components/shared/ExternalLink';

const SettingsPage = () => {
  const dispatch = useDispatch();

  const fullState = useSelector(state => state);
  const isSharing = useSelector(state => state.mr.sharing.isSharing);
  const statusError = useSelector(state => state.mr.sharing.statusError);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
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
    setShowSharingModal(false);
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
              your records by submitting VA Form 10-10163 to your VA Health
              facility.
            </p>
            <p>
              <ExternalLink
                href="https://www.va.gov/resources/about-electronic-health-information-sharing-at-va/"
                text={`Learn how to opt ${optInError ? 'in' : 'out'} by form`}
              />
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
            for the medical records Release of Information office.
          </p>
          <p>
            <ExternalLink
              href="/find-locations/?facilityType=health"
              text="Find your VA health facility"
            />
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
      <>
        <va-card background className="vads-u-padding--3">
          <h3 className="vads-u-margin-top--0">
            Your sharing setting: {isSharing ? 'Opted in' : 'Opted out'}
          </h3>
          {isSharing ? (
            <p>
              We’ll share your electronic health information with participating
              non-VA providers when they’re treating you. You can opt out (ask
              us not to share your records) at any time.
            </p>
          ) : (
            <p>
              We’re not currently sharing your records online with your
              community care providers. If you want us to start sharing your
              records, you can opt back in.
            </p>
          )}
          <va-button
            data-testid="open-opt-in-out-modal-button"
            text={isSharing ? 'Opt out' : 'Opt back in'}
            onClick={() => setShowSharingModal(true)}
          />
        </va-card>
      </>
    );
  };

  const sharingModalContent = () => {
    const title = `Opt ${
      isSharing ? 'out of' : 'back in to'
    } sharing your electronic health information?`;
    return (
      <VaModal
        modalTitle={title}
        onCloseEvent={() => setShowSharingModal(false)}
        onPrimaryButtonClick={() => handleUpdateSharing(isSharing)}
        onSecondaryButtonClick={() => setShowSharingModal(false)}
        primaryButtonText={isSharing ? 'Yes, opt out' : 'Yes, opt in'}
        secondaryButtonText={
          isSharing ? "No, don't opt out" : "No, don't opt in"
        }
        visible
      >
        <p>Equal to VA Form 10-10163</p>
        {isSharing ? (
          <>
            <p>
              If you opt out, your providers may not get your health information
              before treating you.
            </p>
            <p>
              By opting out, you certify that you’re taking this action freely,
              voluntarily, and without coercion. Your new sharing setting will
              stay in effect, unless you opt back in. You can opt back in at any
              time.
            </p>
            <p>
              <strong>Note:</strong> We may still share your health information
              with your non-VA providers in other ways, including by mail or
              fax.
            </p>
          </>
        ) : (
          <>
            <p>
              If you opt back in, we’ll share your electronic health information
              with participating non-VA providers when they’re treating you.
            </p>
            <p>
              By opting in, you certify that you’re taking this action freely,
              voluntarily, and without coercion. Your new sharing setting will
              stay in effect, unless you opt out. You can opt out at any time.
            </p>
          </>
        )}
      </VaModal>
    );
  };

  return (
    <div className="settings vads-u-margin-bottom--5">
      <va-alert
        background-only
        class="vads-u-margin-bottom--4"
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
      <section>
        <h1>Medical records settings</h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-font-family--serif medium-screen:vads-u-font-size--lg">
          Learn how to manage your medical records sharing and notification
          settings.
        </p>
      </section>
      <section>
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
          Manage your electronic sharing settings
        </h2>
        <p>
          We securely share your electronic health information with
          participating non-VA health care providers and federal partners when
          they’re treating you.
        </p>
        <p>
          We automatically include you in electronic sharing. You can change
          your sharing settings at any time.
        </p>

        <div className="vads-u-margin-bottom--3">
          <va-additional-info trigger="What your electronic health information includes">
            <ul>
              <li>
                All allergies and reactions, vaccines, medications, and health
                conditions in your VA medical records
              </li>
              <li>
                Recent lab and test results, vitals, and care summaries and
                notes from VA providers
              </li>
              <li>
                List of your past and future appointments with VA providers
              </li>
              <li>
                Other information your providers may need, such as your
                emergency contacts
              </li>
            </ul>
          </va-additional-info>
        </div>
        {showSharingModal && sharingModalContent()}
        {sharingCardContent()}
      </section>
      <section>
        <p>
          <strong>Note:</strong> If you’ve recently submitted a PDF form to opt
          out, or to opt back in, your request may be in process.
        </p>
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
          Manage your notification settings
        </h2>
        <p>
          You can sign up to get email notifications when medical images you
          requested are available. You can also opt out of email notifications
          at any time.
        </p>
        <p>
          To review or update your notification settings, go to your profile
          page on the My HealtheVet website.
        </p>
        <p>
          <ExternalLink
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            text="Go to your profile on the My Healthevet website"
          />
        </p>
      </section>
    </div>
  );
};

export default SettingsPage;
