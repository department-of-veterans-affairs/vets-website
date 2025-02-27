import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  renderMHVDowntime,
  updatePageTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';

import { getCernerURL } from 'platform/utilities/cerner';
import {
  CernerAlertContent,
  downtimeNotificationParams,
  pageTitles,
} from '../util/constants';
import { createSession } from '../api/MrApi';
import {
  selectConditionsFlag,
  selectNotesFlag,
  selectVaccinesFlag,
  selectVitalsFlag,
  selectLabsAndTestsFlag,
} from '../util/selectors';
import useAcceleratedData from '../hooks/useAcceleratedData';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import { sendDataDogAction } from '../util/helpers';

const LAB_TEST_RESULTS_LABEL = 'Go to your lab and test results';
const CARE_SUMMARIES_AND_NOTES_LABEL = 'Go to your care summaries and notes';
const VACCINES_LABEL = 'Go to your vaccines';
const ALLERGIES_AND_REACTIONS_LABEL = 'Go to your allergies and reactions';
const HEALTH_CONDITIONS_LABEL = 'Go to your health conditions';
const VITALS_LABEL = 'Go to your vitals';
const MEDICAL_RECORDS_SETTINGS_LABEL = 'Go to your medical records settings';
const MEDICAL_RECORDS_DOWNLOAD_LABEL =
  'Go to manage your electronic sharing settings';

const LandingPage = () => {
  const dispatch = useDispatch();
  const displayNotes = useSelector(selectNotesFlag);
  const displayVaccines = useSelector(selectVaccinesFlag);
  const displayConditions = useSelector(selectConditionsFlag);
  const displayVitals = useSelector(selectVitalsFlag);
  const displayLabsAndTest = useSelector(selectLabsAndTestsFlag);

  const {
    isLoading,
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingVitals,
  } = useAcceleratedData();

  const accordionRef = useRef(null);

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
      // Create the user's MHV session when they arrive at the MR landing page
      createSession();
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.MEDICAL_RECORDS_PAGE_TITLE);
    },
    [dispatch],
  );

  return (
    <div className="landing-page">
      <section className="vads-u-margin-bottom--2">
        <h1
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
          Review, print, and download your VA medical records.
        </p>
      </section>

      <CernerFacilityAlert {...CernerAlertContent.MR_LANDING_PAGE} />

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
          {displayLabsAndTest && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Lab and test results
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get results of your VA medical tests. This includes blood tests,
                X-rays, and other imaging tests.
              </p>
              {isAccelerating ? (
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                  href={getCernerURL('/pages/health_record/results', true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="labs-and-tests-oh-landing-page-link"
                >
                  View your labs and tests on My VA Health (opens in new tab)
                </a>
              ) : (
                <Link
                  to="/labs-and-tests"
                  className="vads-c-action-link--blue"
                  data-testid="labs-and-tests-landing-page-link"
                  onClick={() => {
                    sendDataDogAction(LAB_TEST_RESULTS_LABEL);
                  }}
                >
                  {LAB_TEST_RESULTS_LABEL}
                </Link>
              )}
            </section>
          )}
          {displayNotes && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Care summaries and notes
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get notes from your VA providers about your health and health
                care. This includes summaries of your stays in health facilities
                (called admission and discharge summaries).
              </p>
              {isAccelerating ? (
                <>
                  <a
                    className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                    href={getCernerURL(
                      '/pages/health_record/comprehensive_record/health_summaries',
                      true,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="summary-and-notes-oh-landing-page-link"
                  >
                    View your care summaries and notes on My VA Health (opens in
                    new window)
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/summaries-and-notes"
                    className="vads-c-action-link--blue"
                    data-testid="notes-landing-page-link"
                    onClick={() => {
                      sendDataDogAction(CARE_SUMMARIES_AND_NOTES_LABEL);
                    }}
                  >
                    {CARE_SUMMARIES_AND_NOTES_LABEL}
                  </Link>
                </>
              )}
            </section>
          )}
          {displayVaccines && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Vaccines
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get a list of all vaccines (immunizations) in your VA medical
                records.
              </p>
              {isAccelerating ? (
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                  href={getCernerURL(
                    '/pages/health_record/health-record-immunizations',
                    true,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="vaccines-oh-landing-page-link"
                >
                  View your vaccines on My VA Health (opens in new tab)
                </a>
              ) : (
                <Link
                  to="/vaccines"
                  className="vads-c-action-link--blue"
                  data-testid="vaccines-landing-page-link"
                  onClick={() => {
                    sendDataDogAction(VACCINES_LABEL);
                  }}
                >
                  {VACCINES_LABEL}
                </Link>
              )}
            </section>
          )}
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Allergies and reactions
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get a list of all allergies, reactions, and side effects in your
              VA medical records. This includes medication side effects (also
              called adverse drug reactions).
            </p>
            {isAccelerating && !isAcceleratingAllergies ? (
              <a
                className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                href={getCernerURL(
                  '/pages/health_record/health-record-allergies/',
                  true,
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="allergies-oh-landing-page-link"
              >
                View your allergies on My VA Health (opens in new tab)
              </a>
            ) : (
              <Link
                to="/allergies"
                className="vads-c-action-link--blue"
                data-testid="allergies-landing-page-link"
                onClick={() => {
                  sendDataDogAction(ALLERGIES_AND_REACTIONS_LABEL);
                }}
              >
                {ALLERGIES_AND_REACTIONS_LABEL}
              </Link>
            )}
          </section>
          {displayConditions && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Health conditions
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get a list of health conditions your VA providers are helping
                you manage.
              </p>
              {isAccelerating ? (
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                  href={getCernerURL('/pages/health_record/conditions', true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="health-conditions-oh-landing-page-link"
                >
                  View your health conditions on My VA Health (opens in new tab)
                </a>
              ) : (
                <Link
                  to="/conditions"
                  className="vads-c-action-link--blue"
                  data-testid="conditions-landing-page-link"
                  onClick={() => {
                    sendDataDogAction(HEALTH_CONDITIONS_LABEL);
                  }}
                >
                  {HEALTH_CONDITIONS_LABEL}
                </Link>
              )}
            </section>
          )}
          {displayVitals && (
            <section>
              <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                Vitals
              </h2>
              <p className="vads-u-margin-bottom--2">
                Get records of these basic health numbers your providers check
                at appointments:
              </p>
              <ul>
                <li>Blood pressure and blood oxygen level</li>
                <li>Breathing rate and heart rate</li>
                <li>Height and weight</li>
                <li>Temperature</li>
              </ul>
              {isAccelerating && !isAcceleratingVitals ? (
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
                  href={getCernerURL('/pages/health_record/results', true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="vitals-oh-landing-page-link"
                >
                  View your vitals on My VA Health (opens in new tab)
                </a>
              ) : (
                <Link
                  to="/vitals"
                  className="vads-c-action-link--blue"
                  data-testid="vitals-landing-page-link"
                  onClick={() => {
                    sendDataDogAction(VITALS_LABEL);
                  }}
                >
                  {VITALS_LABEL}
                </Link>
              )}
            </section>
          )}

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
              <Link
                to="/download"
                className="vads-c-action-link--blue"
                data-testid="go-to-download-mr-reports"
                onClick={() => {
                  sendDataDogAction(MEDICAL_RECORDS_DOWNLOAD_LABEL);
                }}
              >
                {MEDICAL_RECORDS_DOWNLOAD_LABEL}
              </Link>
            </p>
          </section>

          <section className="vads-u-padding-bottom--3">
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Manage your medical records settings
            </h2>
            <p className="vads-u-margin-bottom--2">
              Review and update your medical records sharing and notification
              settings.
            </p>
            <Link
              to="/settings"
              className="vads-c-action-link--blue"
              data-testid="settings-landing-page-link"
              onClick={() => {
                sendDataDogAction(MEDICAL_RECORDS_SETTINGS_LABEL);
              }}
            >
              {MEDICAL_RECORDS_SETTINGS_LABEL}
            </Link>
          </section>

          <section className="vads-u-margin-x--1p5 vads-u-margin-y--3">
            <h3 className="vads-u-padding-bottom--0p5 vads-u-border-bottom--2px vads-u-border-color--primary">
              Need help?
            </h3>
            <p className="vads-u-margin-top--1">
              Have questions about managing your medical records online?
            </p>
            <va-link
              href="/health-care/review-medical-records/"
              text="Learn more about medical records"
            />
            <p>
              Have questions about health information in your records? Send a
              secure message to your care team.
            </p>
            <va-link
              href="/my-health/secure-messages/new-message/"
              text="Start a new message"
            />
          </section>
        </>
      )}
    </div>
  );
};

export default LandingPage;
