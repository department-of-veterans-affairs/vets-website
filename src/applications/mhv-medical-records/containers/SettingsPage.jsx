import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fetchSharingStatus,
  updateSharingStatus,
  clearSharingStatus,
} from '../actions/sharing';
import { pageTitles } from '../util/constants';
import ExternalLink from '../components/shared/ExternalLink';
import { sendDataDogAction } from '../util/helpers';
import TrackedSpinner from '../components/shared/TrackedSpinner';

const SettingsPage = () => {
  const dispatch = useDispatch();

  const isSharing = useSelector(state => state.mr.sharing.isSharing);
  const statusError = useSelector(state => state.mr.sharing.statusError);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const buttonRef = useRef(null);

  useEffect(
    () => {
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
        // Focus the button after opt-in, when it turns to "Opt out"
        setTimeout(() => focusElement('#opt-in-out-alert'));
      });
    });
  };

  const handleCloseModal = () => {
    setShowSharingModal(false);
    setTimeout(() => focusElement('button', {}, buttonRef.current));
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
          <TrackedSpinner
            id="sharing-status-loading-spinner"
            message="Loading..."
            class="vads-u-margin--4"
            data-testid="sharing-status-loading-indicator"
          />
        </va-card>
      );
    }
    return (
      <va-card className="vads-u-padding--3">
        <h3 className="vads-u-margin-top--0">
          Your sharing setting: {isSharing ? 'Opted in' : 'Opted out'}
        </h3>

        {showSuccessAlert && (
          <va-alert
            slim
            background-only
            class="vads-u-margin-bottom--2"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            status="success"
            visible={showSuccessAlert}
            aria-live="polite"
            id="opt-in-out-alert"
          >
            <p className="vads-u-margin-y--0">
              Opted {isSharing ? 'in to' : 'out of'} sharing
            </p>
          </va-alert>
        )}

        <va-button
          ref={buttonRef}
          data-testid="open-opt-in-out-modal-button"
          text={isSharing ? 'Opt out' : 'Opt in'}
          onClick={() => {
            setShowSharingModal(true);
            sendDataDogAction(
              isSharing ? 'Opt out - Settings page' : 'Opt in - Settings page',
            );
          }}
        />
      </va-card>
    );
  };

  const sharingModalContent = () => {
    const title = `Opt ${
      isSharing ? 'out of' : 'back in to'
    } sharing your electronic health information?`;
    const primaryButtonText = isSharing ? 'Opt out' : 'Opt in';
    const secondaryButtonText = isSharing ? "Don't opt out" : "Don't opt in";
    const handleCloseEvent = () => {
      handleCloseModal();
      sendDataDogAction(`Close opt ${isSharing ? 'out' : 'in'} modal`);
    };
    const handlePrimaryButtonClick = () => {
      handleUpdateSharing(isSharing);
      sendDataDogAction(`${primaryButtonText} - Modal`);
    };
    const handleSecondaryButtonClick = () => {
      handleCloseModal();
      sendDataDogAction(`${secondaryButtonText} - Modal`);
    };
    return (
      <VaModal
        modalTitle={title}
        onCloseEvent={handleCloseEvent}
        onPrimaryButtonClick={handlePrimaryButtonClick}
        onSecondaryButtonClick={handleSecondaryButtonClick}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
        visible
      >
        {isSharing ? (
          <>
            <p>
              If you opt out, your providers may not get your health information
              before treating you.
            </p>
            <p>
              By opting out, you certify that you’re taking this action freely,
              voluntarily, and without coercion. Your new sharing setting will
              stay in effect unless you opt back in. You can opt back in at any
              time.
            </p>
            <p>Opting out is the same as submitting VA Form 10-10163.</p>
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
              stay in effect unless you opt out. You can opt out at any time.
            </p>
            <p>Opting out is the same as submitting VA Form 10-10163.</p>
          </>
        )}
      </VaModal>
    );
  };

  return (
    <div className="settings vads-u-margin-bottom--5">
      <section>
        <h1>Manage your electronic sharing settings</h1>
      </section>
      <section>
        <p>
          If your sharing setting is “opted in,” we securely share your
          electronic health information with participating non-VA health care
          providers and federal partners when they’re treating you.
        </p>
        <p>
          We automatically include you in electronic sharing. You can change
          your sharing settings here at any time.
        </p>

        {showSharingModal && sharingModalContent()}
        {sharingCardContent()}
      </section>
      <section>
        <p>
          <strong>Note:</strong> If you’ve recently submitted a PDF form to opt
          out or to opt back in, your request may be in process.
        </p>
        <div className="vads-u-margin-bottom--3">
          <va-additional-info
            data-dd-action-name="What your EHI includes"
            trigger="What your electronic health information includes"
          >
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
      </section>
    </div>
  );
};

export default SettingsPage;
