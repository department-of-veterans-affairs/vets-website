import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  renderMHVDowntime,
  updatePageTitle,
  openCrisisModal,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

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
  selectMarch17UpdatesFlag,
} from '../util/selectors';
import ExternalLink from '../components/shared/ExternalLink';
import useAcceleratedData from '../hooks/useAcceleratedData';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import { sendDataDogAction } from '../util/helpers';

const LAB_TEST_RESULTS_LABEL = 'Go to your lab and test results';
const CARE_SUMMARIES_AND_NOTES_LABEL = 'Go to your care summaries and notes';
const VACCINES_LABEL = 'Go to your vaccines';
const ALLERGIES_AND_REACTIONS_LABEL = 'Go to your allergies and reactions';
const HEALTH_CONDITIONS_LABEL = 'Go to your health conditions';
const VITALS_LABEL = 'Go to your vitals';
const MEDICAL_RECORDS_DOWNLOAD_LABEL =
  'Go to download your medical records reports';
const MEDICAL_RECORDS_SETTINGS_LABEL =
  'Go to manage your electronic sharing settings';

const LandingPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const displayNotes = useSelector(selectNotesFlag);
  const displayVaccines = useSelector(selectVaccinesFlag);
  const displayConditions = useSelector(selectConditionsFlag);
  const displayVitals = useSelector(selectVitalsFlag);
  const displayLabsAndTest = useSelector(selectLabsAndTestsFlag);
  const displayMarch17Updates = useSelector(selectMarch17UpdatesFlag);
  const killExternalLinks = useSelector(
    state => state.featureToggles.mhv_medical_records_kill_external_links,
  );

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
          {displayMarch17Updates ? (
            <>
              Review, print, and download your VA medical records. Tell your
              provider about any changes in your health at each appointment.
            </>
          ) : (
            <>Review, print, and download your VA medical records.</>
          )}
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

          {!displayMarch17Updates && (
            <>
              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Manage your medical records settings
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Review and update your medical records sharing and
                  notification settings.
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
              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Download your medical records reports
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Download full reports of your medical records or your self
                  entered health information.
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
            </>
          )}

          {displayMarch17Updates && (
            <>
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
                  Manage your electronic sharing settings
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Review and update your medical records sharing and
                  notification settings.
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
            </>
          )}

          {displayMarch17Updates ? (
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
          ) : (
            <>
              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  What to know as you try out this tool
                </h2>
                <p className="vads-u-margin-bottom--2">
                  We’re giving the trusted My HealtheVet medical records tool a
                  new home here on VA.gov. And we need your feedback to help us
                  keep making this tool better for you and all Veterans.
                </p>
                <p className="vads-u-margin-bottom--2">
                  Send us your feedback and questions using the feedback button
                  on this page.
                </p>
                <p className="vads-u-margin-bottom--2">
                  <span className="vads-u-font-weight--bold">Note:</span> You
                  still have access to your medical records on the My HealtheVet
                  website. You can go back to that site at any time.{' '}
                  <ExternalLink
                    href={mhvUrl(
                      isAuthenticatedWithSSOe(fullState),
                      'download-my-data',
                    )}
                    text="Go to your medical records on the My HealtheVet website"
                    ddTag="Go back to MHV to download"
                  />
                </p>
              </section>

              <section className="vads-u-margin-bottom--4">
                <h2>Questions about this medical records tool</h2>
                <va-accordion bordered>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="Where can I find health information"
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      Where can I find health information I entered myself?
                    </h3>
                    <div>
                      <p className="vads-u-margin-bottom--2">
                        Download your self-entered health information report.
                      </p>
                      <p className="vads-u-margin-bottom--2">
                        <Link
                          to="/download"
                          onClick={() => {
                            sendDataDogAction(MEDICAL_RECORDS_DOWNLOAD_LABEL);
                          }}
                        >
                          {MEDICAL_RECORDS_DOWNLOAD_LABEL}
                        </Link>
                      </p>
                    </div>
                  </va-accordion-item>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="How can I tell my care team "
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      How can I tell my care team that my health information has
                      changed?
                    </h3>

                    <p className="vads-u-margin-bottom--2">
                      If you need to add or change health information in your
                      records, you can tell your provider at your next
                      appointment.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      Or you can send a secure message to your care team and ask
                      them to update your records.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      <va-link
                        href="/my-health/secure-messages/new-message/"
                        text="Start a new message"
                        onClick={() => {
                          sendDataDogAction('Start a new message - FAQ');
                        }}
                      />
                    </p>
                  </va-accordion-item>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="Will VA protect my PHI"
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      Will VA protect my personal health information?
                    </h3>
                    <p className="vads-u-margin-bottom--2">
                      Yes. This is a secure website. We follow strict security
                      policies and practices to protect your personal health
                      information. Only you and your VA care team will have
                      access to your records.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      If you print or download any records, you’ll need to take
                      responsibility for protecting that information. If you’re
                      on a public or shared computer, remember that downloading
                      will save a copy of your records to the computer you’re
                      using.
                    </p>
                  </va-accordion-item>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="What if I have more questions"
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      What if I have more questions?
                    </h3>
                    <p className="vads-u-margin-bottom--2">
                      <span className="vads-u-font-weight--bold">
                        For questions about health information in your records,{' '}
                      </span>
                      send a secure message to your care team.
                    </p>

                    <p className="vads-u-margin-bottom--2">
                      <va-link
                        href="/my-health/secure-messages/new-message/"
                        text="Start a new message"
                        onClick={() => {
                          sendDataDogAction('Start a new message - FAQ');
                        }}
                      />
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      Only use messages for non-urgent needs. Your care team may
                      take up to{' '}
                      <span className="vads-u-font-weight--bold">
                        3 business days
                      </span>{' '}
                      to reply.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      If you need help sooner, use one of these urgent
                      communication options:
                    </p>
                    <ul>
                      <li>
                        <span className="vads-u-font-weight--bold">
                          If you’re in crisis or having thoughts of suicide,
                        </span>{' '}
                        connect with our Veterans Crisis Line. We offer
                        confidential support anytime, day or night.
                        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
                          <va-button
                            secondary="true"
                            text="Connect with the Veterans Crisis Line"
                            onClick={() => {
                              if (!killExternalLinks) openCrisisModal();
                              sendDataDogAction('VCL Button  - FAQ');
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <span className="vads-u-font-weight--bold">
                          If you think your life or health is in danger,
                        </span>{' '}
                        call 911 or go to the nearest emergency room.
                      </li>
                    </ul>
                    {!killExternalLinks && (
                      <>
                        <p className="vads-u-margin-bottom--2">
                          <va-link
                            href="/my-health/secure-messages/new-message/"
                            text="Start a new message"
                            onClick={() => {
                              sendDataDogAction('Start a new message - FAQ');
                            }}
                          />
                        </p>
                      </>
                    )}
                  </va-accordion-item>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="Will VA protect my PHI"
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      Will VA protect my personal health information?
                    </h3>
                    <p className="vads-u-margin-bottom--2">
                      Yes. This is a secure website. We follow strict security
                      policies and practices to protect your personal health
                      information. Only you and your VA care team will have
                      access to your records.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      If you print or download any records, you’ll need to take
                      responsibility for protecting that information. If you’re
                      on a public or shared computer, remember that downloading
                      will save a copy of your records to the computer you’re
                      using.
                    </p>
                  </va-accordion-item>
                  <va-accordion-item
                    bordered="true"
                    data-dd-action-name="What if I have more questions"
                  >
                    <h3 className="vads-u-font-size--h6" slot="headline">
                      What if I have more questions?
                    </h3>
                    <p className="vads-u-margin-bottom--2">
                      <span className="vads-u-font-weight--bold">
                        For questions about health information in your records,{' '}
                      </span>
                      send a secure message to your care team.
                    </p>

                    <p className="vads-u-margin-bottom--2">
                      <va-link
                        href="/my-health/secure-messages/new-message/"
                        text="Start a new message"
                        onClick={() => {
                          sendDataDogAction('Start a new message - FAQ');
                        }}
                      />
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      Only use messages for non-urgent needs. Your care team may
                      take up to{' '}
                      <span className="vads-u-font-weight--bold">
                        3 business days
                      </span>{' '}
                      to reply.
                    </p>
                    <p className="vads-u-margin-bottom--2">
                      If you need help sooner, use one of these urgent
                      communication options:
                    </p>
                    <ul>
                      <li>
                        <span className="vads-u-font-weight--bold">
                          If you’re in crisis or having thoughts of suicide,
                        </span>{' '}
                        connect with our Veterans Crisis Line. We offer
                        confidential support anytime, day or night.
                        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
                          <va-button
                            secondary="true"
                            text="Connect with the Veterans Crisis Line"
                            onClick={() => {
                              sendDataDogAction('VCL Button  - FAQ');
                              if (!killExternalLinks) openCrisisModal();
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <span className="vads-u-font-weight--bold">
                          If you think your life or health is in danger,
                        </span>{' '}
                        call 911 or go to the nearest emergency room.
                      </li>
                    </ul>
                    {!killExternalLinks && (
                      <>
                        <p className="vads-u-margin-bottom--2">
                          <span className="vads-u-font-weight--bold">
                            For questions about how to use this tool,{' '}
                          </span>
                          <span>
                            call us at{' '}
                            <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
                            <va-telephone tty contact={CONTACTS['711']} />
                            ). We’re here Monday through Friday, 8:00 a.m. to
                            8:00 p.m. ET.
                          </span>
                        </p>
                      </>
                    )}
                  </va-accordion-item>
                </va-accordion>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LandingPage;
