import React, { useEffect } from 'react';
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
import { setBreadcrumbs } from '../actions/breadcrumbs';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { downtimeNotificationParams, pageTitles } from '../util/constants';
import { createSession } from '../api/MrApi';
import {
  selectConditionsFlag,
  selectNotesFlag,
  selectVaccinesFlag,
  selectVitalsFlag,
  selectLabsAndTestsFlag,
} from '../util/selectors';

const LandingPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const displayNotes = useSelector(selectNotesFlag);
  const displayVaccines = useSelector(selectVaccinesFlag);
  const displayConditions = useSelector(selectConditionsFlag);
  const displayVitals = useSelector(selectVitalsFlag);
  const displayLabsAndTest = useSelector(selectLabsAndTestsFlag);

  useEffect(
    () => {
      // Create the user's MHV session when they arrive at the MR landing page
      createSession();
      dispatch(
        setBreadcrumbs([], {
          url: '/',
          label: 'Medical records',
        }),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.MEDICAL_RECORDS_PAGE_TITLE);
    },
    [dispatch],
  );

  return (
    <div className="landing-page">
      <section>
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
      {displayLabsAndTest && (
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            Lab and Test results
          </h2>
          <p className="vads-u-margin-bottom--2">
            Get results of your VA medical tests. This includes blood tests,
            X-rays, and other imaging tests.
          </p>
          <Link
            to="/labs-and-tests"
            className="vads-c-action-link--blue"
            data-testid="labs-and-tests-landing-page-link"
          >
            Go to your lab and test results
          </Link>
        </section>
      )}
      {displayNotes && (
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            Care summaries and notes
          </h2>
          <p className="vads-u-margin-bottom--2">
            Get notes from your VA providers about your health and health care.
            This includes summaries of your stays in health facilities (called
            admission and discharge summaries).
          </p>
          <Link
            to="/summaries-and-notes"
            className="vads-c-action-link--blue"
            data-testid="notes-landing-page-link"
          >
            Go to your care summaries and notes
          </Link>
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
          <Link
            to="/vaccines"
            className="vads-c-action-link--blue"
            data-testid="vaccines-landing-page-link"
          >
            Go to your vaccines
          </Link>
        </section>
      )}
      <section>
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
          Allergies and reactions
        </h2>
        <p className="vads-u-margin-bottom--2">
          Get a list of all allergies, reactions, and side effects in your VA
          medical records. This includes medication side effects (also called
          adverse drug reactions).
        </p>
        <Link
          to="/allergies"
          className="vads-c-action-link--blue"
          data-testid="allergies-landing-page-link"
        >
          Go to your allergies and reactions
        </Link>
      </section>
      {displayConditions && (
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            Health conditions
          </h2>
          <p className="vads-u-margin-bottom--2">
            Get a list of health conditions your VA providers are helping you
            manage.
          </p>
          <Link
            to="/conditions"
            className="vads-c-action-link--blue"
            data-testid="conditions-landing-page-link"
          >
            Go to your health conditions
          </Link>
        </section>
      )}
      {displayVitals && (
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
          <Link
            to="/vitals"
            className="vads-c-action-link--blue"
            data-testid="vitals-landing-page-link"
          >
            Go to your vitals
          </Link>
        </section>
      )}
      {(!displayLabsAndTest ||
        !displayNotes ||
        !displayVaccines ||
        !displayConditions ||
        !displayVitals) && (
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            How to find your other medical records
          </h2>
          <p className="vads-u-margin-bottom--2">
            Right now, only some of your medical records are available here on
            VA.gov. Soon, you’ll be able to find these types of medical records
            on this page:
          </p>
          <ul>
            {!displayLabsAndTest && <li>Lab and test results</li>}
            {!displayNotes && <li>Care summaries and notes</li>}
            {!displayVaccines && <li>Vaccines</li>}
            {!displayConditions && <li>Health conditions</li>}
            {!displayVitals && <li>Vitals</li>}
          </ul>
          <p className="vads-u-margin-bottom--2">
            To find your other medical records now, you’ll need to go back to
            the My HealtheVet website.
          </p>
          <p className="vads-u-margin-bottom--2">
            <a
              href={mhvUrl(
                isAuthenticatedWithSSOe(fullState),
                'download-my-data',
              )}
              rel="noreferrer"
            >
              Go to medical records on the My HealtheVet website
            </a>
          </p>
        </section>
      )}
      <section>
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
          Download your VA medical records
        </h2>
        <p className="vads-u-margin-bottom--2">
          We’re working on a way for you to download your VA medical records
          here on VA.gov. For now, you can continue to download your VA Blue
          Button® report or your VA Health Summary on the previous version of My
          HealtheVet.
        </p>
        <p
          data-testid="go-to-mhv-download-records"
          className="vads-u-margin-bottom--2"
        >
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            rel="noreferrer"
          >
            Go back to the previous version of My HealtheVet to download your
            records.
          </a>
        </p>
      </section>
      <section>
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
          What to know as you try out this tool
        </h2>
        <p className="vads-u-margin-bottom--2">
          We’re giving the trusted My HealtheVet medical records tool a new home
          here on VA.gov. And we need your feedback to help us keep making this
          tool better for you and all Veterans.
        </p>
        <p className="vads-u-margin-bottom--2">
          Email your feedback and questions to us at <FeedbackEmail />.
        </p>
        <p className="vads-u-margin-bottom--2">
          <span className="vads-u-font-weight--bold">Note:</span> You still have
          access to your medical records on the My HealtheVet website. You can
          go back to that site at any time.{' '}
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            rel="noreferrer"
          >
            Go back to medical records on the My HealtheVet website
          </a>
        </p>
      </section>
      <section className="vads-u-margin-bottom--4">
        <h2>Questions about this medical records tool</h2>
        <va-accordion bordered>
          <va-accordion-item>
            <h3 className="vads-u-font-size--h6" slot="headline">
              What if I can’t find all my medical records?
            </h3>
            {!displayLabsAndTest ||
            !displayNotes ||
            !displayVaccines ||
            !displayConditions ||
            !displayVitals ? (
              <>
                <p className="vads-u-margin-bottom--2">
                  Right now, only some types of medical records are available
                  here on VA.gov. And your records on VA.gov only include health
                  information your VA providers have entered.
                </p>
                <p className="vads-u-margin-bottom--2">
                  To find other types of medical records
                  <code>&#8212;</code>
                  including health information you entered yourself
                  <code>&#8212;</code>
                  go to your medical records on the My HealtheVet website.
                </p>
              </>
            ) : (
              <>
                <p className="vads-u-margin-bottom--2">
                  Your medical records on VA.gov only include health information
                  your VA providers have entered.
                </p>
                <p className="vads-u-margin-bottom--2">
                  To find health information you entered yourself, go to your
                  medical records on the My HealtheVet website.
                </p>
              </>
            )}
            <p className="vads-u-margin-bottom--2">
              <a
                href={mhvUrl(
                  isAuthenticatedWithSSOe(fullState),
                  'download-my-data',
                )}
                rel="noreferrer"
              >
                Go to medical records on the My HealtheVet website
              </a>
            </p>
          </va-accordion-item>
          <va-accordion-item>
            <h3 className="vads-u-font-size--h6" slot="headline">
              How can I tell my care team that my health information has
              changed?
            </h3>

            <p className="vads-u-margin-bottom--2">
              If you need to add or change health information in your records,
              you can tell your provider at your next appointment.
            </p>
            <p className="vads-u-margin-bottom--2">
              Or you can send a secure message to your care team and ask them to
              update your records.
            </p>
            <p className="vads-u-margin-bottom--2">
              <a
                href={mhvUrl(
                  isAuthenticatedWithSSOe(fullState),
                  'compose-message',
                )}
              >
                Compose a message on the My HealtheVet website
              </a>
            </p>
          </va-accordion-item>
          <va-accordion-item>
            <h3 className="vads-u-font-size--h6" slot="headline">
              Will VA protect my personal health information?
            </h3>
            <p className="vads-u-margin-bottom--2">
              Yes. This is a secure website. We follow strict security policies
              and practices to protect your personal health information. Only
              you and your VA care team will have access to your records.
            </p>
            <p className="vads-u-margin-bottom--2">
              If you print or download any records, you’ll need to take
              responsibility for protecting that information. If you’re on a
              public or shared computer, remember that downloading will save a
              copy of your records to the computer you’re using.
            </p>
          </va-accordion-item>
          <va-accordion-item>
            <h3 className="vads-u-font-size--h6" slot="headline">
              What if I have more questions?
            </h3>
            <p className="vads-u-margin-bottom--2">
              <span className="vads-u-font-weight--bold">
                For questions about health information in your records
              </span>
            </p>
            <p className="vads-u-margin-bottom--2">
              Send a secure message to your care team.
            </p>
            <p className="vads-u-margin-bottom--2">
              <a
                href={mhvUrl(
                  isAuthenticatedWithSSOe(fullState),
                  'compose-message',
                )}
              >
                Compose a message on the My HealtheVet website
              </a>
            </p>
            <p className="vads-u-margin-bottom--2">
              Only use messages for non-urgent needs. Your care team may take up
              to{' '}
              <span className="vads-u-font-weight--bold">3 business days</span>{' '}
              to reply.
            </p>
            <p className="vads-u-margin-bottom--2">
              If you need help sooner, use one of these urgent communication
              options:
            </p>
            <ul>
              <li>
                <span className="vads-u-font-weight--bold">
                  If you’re in crisis or having thoughts of suicide,
                </span>{' '}
                connect with our Veterans Crisis Line. We offer confidential
                support anytime, day or night.
                <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
                  <va-button
                    secondary="true"
                    text="Connect with the Veterans Crisis Line"
                    onClick={openCrisisModal}
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
            <p className="vads-u-margin-bottom--2">
              <span className="vads-u-font-weight--bold">
                For questions about how to use this tool
              </span>
            </p>
            <p className="vads-u-margin-bottom--2">
              Email us at <FeedbackEmail />.
            </p>
          </va-accordion-item>
        </va-accordion>
      </section>
    </div>
  );
};

export default LandingPage;
