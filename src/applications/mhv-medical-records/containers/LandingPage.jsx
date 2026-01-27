import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  renderMHVDowntime,
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';

import CernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import { downtimeNotificationParams, pageTitles } from '../util/constants';
import { selectImagesDomainFlag } from '../util/selectors';
import { createSession, postCreateAAL } from '../api/MrApi';
import { sendDataDogAction } from '../util/helpers';

const LAB_TEST_RESULTS_LABEL = 'Go to your lab and test results';
const IMAGING_RESULTS_LABEL = 'Go to your medical imaging results';
export const CARE_SUMMARIES_AND_NOTES_LABEL =
  'Go to your care summaries and notes';
export const VACCINES_LABEL = 'Go to your vaccines';
export const ALLERGIES_AND_REACTIONS_LABEL =
  'Go to your allergies and reactions';
export const HEALTH_CONDITIONS_LABEL = 'Go to your health conditions';
export const VITALS_LABEL = 'Go to your vitals';
const MEDICAL_RECORDS_DOWNLOAD_LABEL =
  'Go to download your medical records reports';
export const MEDICAL_RECORDS_REQUEST_LABEL =
  'Learn more about submitting a medical records request';
export const MEDICAL_RECORDS_SETTINGS_LABEL =
  'Go to manage your electronic sharing settings';
const SHARE_PERSONAL_HEALTH_DATA_WITH_YOUR_CARE_TEAM =
  'Go to the Share My Health Data website';

const LandingPage = () => {
  const dispatch = useDispatch();

  const { isLoading } = useAcceleratedData();
  const history = useHistory();
  const showImagesDomain = useSelector(selectImagesDomainFlag);

  const accordionRef = useRef(null);

  const headingRef = useRef(null);

  useEffect(() => {
    const expandButton = accordionRef.current?.shadowRoot?.querySelector(
      'button.va-accordion__button',
    );
    const handleClick = () => {
      sendDataDogAction('Accordion Expand button');
    };
    if (expandButton) {
      expandButton.addEventListener('click', handleClick);
    }
    // Cleanup function to remove the event listener
    // prevents multiple event listeners from being added
    return () => {
      if (expandButton) {
        expandButton.removeEventListener('click', handleClick);
      }
    };
  });

  useEffect(
    () => {
      setTimeout(() => {
        const heading = headingRef.current;
        focusElement(heading);
      }, 400);
    },
    [headingRef],
  );

  useEffect(
    () => {
      // Create the user's MHV session when they arrive at the MR landing page
      createSession();

      updatePageTitle(pageTitles.MEDICAL_RECORDS_PAGE_TITLE);
    },
    [dispatch],
  );

  const sendAalViewList = activityType => {
    postCreateAAL({
      activityType,
      action: 'View',
      performerType: 'Self',
      status: 1,
      oncePerSession: true,
    });
  };

  return (
    <div className="landing-page">
      <section className="vads-u-margin-bottom--2">
        <h1
          ref={headingRef}
          className="vads-u-margin-top--0 vads-u-margin-bottom--1"
          data-testid="mr-landing-page-title"
        >
          Medical records
        </h1>
        <DowntimeNotification
          appTitle={downtimeNotificationParams.appTitle}
          dependencies={[
            externalServices.mhvMr,
            externalServices.mhvPlatform,
            externalServices.global,
          ]}
          render={renderMHVDowntime}
        />
        <p className="va-introtext vads-u-margin-bottom--0">
          Review, print, and download your VA medical records. Tell your
          provider about any changes in your health at each appointment.
        </p>
      </section>

      <CernerFacilityAlert {...CernerAlertContent.MEDICAL_RECORDS} />

      {isLoading && (
        <section>
          <va-loading-indicator
            message="Loading your medical records..."
            set-focus
          />
        </section>
      )}

      {!isLoading && (
        <>
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Lab and test results
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get results of your VA medical tests, including blood tests.
            </p>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/labs-and-tests"
              data-testid="labs-and-tests-landing-page-link"
              text={LAB_TEST_RESULTS_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/labs-and-tests');
                sendAalViewList('Lab and test results');
                sendDataDogAction(LAB_TEST_RESULTS_LABEL);
              }}
            />
          </section>
          {showImagesDomain && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Medical imaging results
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get results of your VA imaging tests, including X-rays, MRIs,
                and CT scans.
              </p>
              <va-link-action
                type="secondary"
                href="/my-health/medical-records/imaging-results"
                data-testid="radiology-landing-page-link"
                text={IMAGING_RESULTS_LABEL}
                onClick={event => {
                  event.preventDefault();
                  history.push('/imaging-results');
                  sendAalViewList('Radiology');
                  sendDataDogAction(IMAGING_RESULTS_LABEL);
                }}
              />
            </section>
          )}
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Care summaries and notes
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get notes from your VA providers about your health and health
              care. This includes summaries of your stays in health facilities
              (called admission and discharge summaries).
            </p>
            <>
              <va-link-action
                type="secondary"
                href="/my-health/medical-records/summaries-and-notes"
                data-testid="notes-landing-page-link"
                text={CARE_SUMMARIES_AND_NOTES_LABEL}
                onClick={event => {
                  event.preventDefault();
                  history.push('/summaries-and-notes');
                  sendAalViewList('Care Summaries and Notes');
                  sendDataDogAction(CARE_SUMMARIES_AND_NOTES_LABEL);
                }}
              />
            </>
          </section>
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Vaccines
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get a list of all vaccines (immunizations) in your VA medical
              records.
            </p>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/vaccines"
              data-testid="vaccines-landing-page-link"
              text={VACCINES_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/vaccines');
                sendAalViewList('Vaccines');
                sendDataDogAction(VACCINES_LABEL);
              }}
            />
          </section>
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Allergies and reactions
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get a list of all allergies, reactions, and side effects in your
              VA medical records. This includes medication side effects (also
              called adverse drug reactions).
            </p>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/allergies"
              data-testid="allergies-landing-page-link"
              text={ALLERGIES_AND_REACTIONS_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/allergies');
                sendAalViewList('Allergy and Reactions');
                sendDataDogAction(ALLERGIES_AND_REACTIONS_LABEL);
              }}
            />
          </section>
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Health conditions
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get a list of health conditions your VA providers are helping you
              manage.
            </p>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/conditions"
              data-testid="conditions-landing-page-link"
              text={HEALTH_CONDITIONS_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/conditions');
                sendAalViewList('Health Conditions');
                sendDataDogAction(HEALTH_CONDITIONS_LABEL);
              }}
            />
          </section>
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Vitals
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get records of these basic health numbers your providers check at
              appointments:
            </p>
            <ul>
              <li>Blood pressure and blood oxygen level</li>
              <li>Breathing rate and heart rate</li>
              <li>Height and weight</li>
              <li>Temperature</li>
            </ul>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/vitals"
              data-testid="vitals-landing-page-link"
              text={VITALS_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/vitals');
                sendAalViewList('Vitals');
                sendDataDogAction(VITALS_LABEL);
              }}
            />
          </section>
          <div className="vads-u-display--block vads-u-width--full vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-top--4 vads-u-margin-top--1p5" />
          <section className="vads-u-padding-top--1p5">
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Download your medical records
            </h2>
            <p className="vads-u-margin-bottom--2">
              Download full reports of your VA medical records or your
              self-entered health information.
            </p>
            <p
              data-testid="go-to-mhv-download-records"
              className="vads-u-margin-bottom--2"
            >
              <va-link-action
                type="secondary"
                href="/my-health/medical-records/download"
                data-testid="go-to-download-mr-reports"
                text={MEDICAL_RECORDS_DOWNLOAD_LABEL}
                onClick={event => {
                  event.preventDefault();
                  history.push('/download');
                  sendDataDogAction(MEDICAL_RECORDS_DOWNLOAD_LABEL);
                }}
              />
            </p>
          </section>
          <section className="vads-u-padding-bottom--3">
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              What to do if you can’t find your medical records
            </h2>
            <p className="vads-u-margin-bottom--2">
              Some of your medical records may not be available on VA.gov right
              now. If you need to access your records and can’t find them here,
              you can submit a medical records request. You can submit your
              request by secure message, by mail, by fax, or in person at your
              VA health facility.
            </p>
            <va-link-action
              type="secondary"
              href="/resources/how-to-get-your-medical-records-from-your-va-health-facility/"
              data-testid="gps-landing-page-link"
              text={MEDICAL_RECORDS_REQUEST_LABEL}
              onClick={() => {
                sendDataDogAction(MEDICAL_RECORDS_REQUEST_LABEL);
              }}
            />
          </section>
          <section className="vads-u-padding-bottom--3">
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Manage your electronic sharing settings
            </h2>
            <p className="vads-u-margin-bottom--2">
              Review and update your medical records sharing and notification
              settings.
            </p>
            <va-link-action
              type="secondary"
              href="/my-health/medical-records/settings"
              data-testid="settings-landing-page-link"
              text={MEDICAL_RECORDS_SETTINGS_LABEL}
              onClick={event => {
                event.preventDefault();
                history.push('/settings');
                sendDataDogAction(MEDICAL_RECORDS_SETTINGS_LABEL);
              }}
            />
          </section>
          <section className="vads-u-padding-bottom--3">
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Share personal health data with your care team
            </h2>
            <p className="vads-u-margin-bottom--2">
              You can share your personal health data with your care team using
              the Share My Health Data website.
            </p>
            <va-link
              href={
                environment.isProduction()
                  ? 'https://veteran.apps.va.gov/smhdWeb'
                  : 'https://veteran.apps-staging.va.gov/smhdWeb'
              }
              text={SHARE_PERSONAL_HEALTH_DATA_WITH_YOUR_CARE_TEAM}
              data-testid="health-data-landing-page-link"
              onClick={() => {
                sendDataDogAction(
                  SHARE_PERSONAL_HEALTH_DATA_WITH_YOUR_CARE_TEAM,
                );
              }}
            />
          </section>
          <section className="vads-u-margin-y--3">
            <h3 className="vads-u-padding-bottom--0p5 vads-u-border-bottom--2px vads-u-border-color--primary">
              Need help?
            </h3>
            <p className="vads-u-margin-top--1">
              Have questions about managing your medical records online?
            </p>
            <va-link
              href="/health-care/review-medical-records/"
              text="Learn more about medical records"
              onClick={() => {
                sendDataDogAction('Learn more about medical records');
              }}
            />
            <p>
              Have questions about health information in your records? Send a
              secure message to your care team.
            </p>
            <va-link
              href="/my-health/secure-messages/new-message/"
              text="Start a new message"
              onClick={() => {
                sendDataDogAction('Start a new message - MR help');
              }}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default LandingPage;
