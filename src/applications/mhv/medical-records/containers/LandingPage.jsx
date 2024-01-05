import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { openCrisisModal, updatePageTitle } from '../../shared/util/helpers';
import { pageTitles } from '../util/constants';
import { createSession } from '../api/MrApi';

const LandingPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const { displayVaccines } = useSelector(
    state => {
      return {
        displayVaccines:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines
          ],
      };
    },
    state => state.featureToggles,
  );

  useEffect(
    () => {
      // Create the user's MHV session when they arrive at the MR landing page
      createSession();
      dispatch(
        setBreadcrumbs([], {
          url: '/my-health/medical-records',
          label: 'Medical records',
        }),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.MEDICAL_RECORDS_PAGE_TITLE);
    },
    [dispatch],
  );

  return (
    <>
      <div>
        <section>
          <h1 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
            Medical records
          </h1>
          <p className="va-introtext vads-u-margin-bottom--0">
            Review, print, and download your VA medical records.
          </p>
        </section>
        {displayVaccines && (
          <section>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Vaccines
            </h2>
            <p className="vads-u-margin-bottom--2">
              Get a list of all vaccines (immunizations) in your VA medical
              records.
            </p>
            <Link to="/vaccines" className="vads-c-action-link--blue">
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
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            How to find your other medical records
          </h2>
          <p className="vads-u-margin-bottom--2">
            Right now, only your allergy records{' '}
            {displayVaccines && 'and vaccine records '}
            are available here on VA.gov. Soon, you’ll be able to find these
            types of medical records on this page:
          </p>
          <ul>
            <li>Lab and test results</li>
            <li>Care summaries and notes</li>
            {!displayVaccines && <li>Vaccines</li>}
            <li>Health conditions</li>
            <li>Vitals</li>
          </ul>
          <p className="vads-u-margin-bottom--2">
            To find your other medical records now, you’ll need to go to your
            medical records on the My HealtheVet website.
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
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            What to know as you try out this tool
          </h2>
          <p className="vads-u-margin-bottom--2">
            We’re giving the trusted My HealtheVet medical records tool a new
            home here on VA.gov. And we need your feedback to help us keep
            making this tool better for you and all Veterans.
          </p>
          <p className="vads-u-margin-bottom--2">
            Email your feedback and questions to us at <FeedbackEmail />.
          </p>
          <p className="vads-u-margin-bottom--2">
            <span className="vads-u-font-weight--bold">Note:</span> You still
            have access to your medical records on the My HealtheVet website.
            You can go back to that site at any time.{' '}
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

        {/* 
        <section>
          <h2>Lab and test results</h2>
          <p>
            Get results of your VA medical tests. This includes blood tests,
            X-rays, and other imaging tests.
          </p>
          <va-link
            active
            href="/my-health/medical-records/labs-and-tests"
            text="Go to your lab and test results"
          />
        </section>
        <section>
          <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
            Care summaries and notes
          </h2>
          <p className="vads-u-margin-top--1">
            Get notes from your VA providers about your health and health care.
            This includes summaries of your stays in health facilities (called
            admission and discharge summaries).
          </p>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/summaries-and-notes"
            text="Go to your care summaries and notes"
            data-testid="section-link"
          />
          <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
            After-visit summaries
          </h3>
          <p className="vads-u-margin-top--1">
            To find after-visit summaries of your appointments, go to your
            appointment records.
          </p>
          <va-link
            className="section-link"
            active
            href=""
            text="Go to your appointments to review after-visit summaries"
            data-testid="section-link"
          />
        </section>
        <section>
          <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
            Health conditions
          </h2>
          <p className="vads-u-margin-top--1">
            Get a list of health conditions your VA providers are helping you
            manage.
          </p>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/conditions"
            text="Go to your health conditions"
            data-testid="section-link"
          />
        </section>
        <section>
          <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
            Vitals
          </h2>
          <p className="vads-u-margin-top--1">
            Get records of these basic health numbers your providers check at
            appointments:
          </p>
          <ul>
            <li>Blood pressure and blood oxygen level</li>
            <li>Breathing rate and heart rate</li>
            <li>Height and weight</li>
            <li>Pain level</li>
            <li>Temperature</li>
          </ul>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/vitals"
            text="Go to your vitals"
            data-testid="section-link"
          />
        </section>
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            Download all your medical records
          </h2>
          <p className="vads-u-margin-top--1">
            You can download all your records as a single file. This file will
            include all your lab and test results, care summaries, vaccines,
            allergies, health conditions, and vitals.
          </p>
          <va-link
            className="section-link"
            active
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            text="Download all your medical records"
            data-testid="section-link"
          />
        </section>
        <section>
          <h2>Manage your medical record settings</h2>
          <p className="vads-u-margin-top--1">
            Review and update your medical records sharing and notification
            settings.
          </p>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/settings"
            text="Go to your medical records settings"
            data-testid="section-link"
          />
        </section>
        */}

        <section className="vads-u-margin-bottom--4">
          <h2>Questions about this medical records tool</h2>
          <va-accordion bordered>
            {displayVaccines ? (
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What if I can’t find all my medical records?
                </h3>
                <p className="vads-u-margin-bottom--2">
                  Right now, only your allergy and vaccine records are available
                  here on VA.gov. And this tool only includes health information
                  your VA providers have entered.
                </p>
                <p className="vads-u-margin-bottom--2">
                  To find other types of medical records
                  <code>&#8212;</code>
                  including health information you entered yourself
                  <code>&#8212;</code>
                  go to your medical records on the My HealtheVet website.
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
              </va-accordion-item>
            ) : (
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What if I can’t find all my allergy records?
                </h3>
                <p className="vads-u-margin-bottom--2">
                  This tool only includes health information your VA providers
                  have entered.
                </p>
                <p className="vads-u-margin-bottom--2">
                  To find health information you entered yourself, go to your VA
                  Blue Button&reg; report on the My HealtheVet website.
                </p>
                <p className="vads-u-margin-bottom--2">
                  <a
                    href={mhvUrl(
                      isAuthenticatedWithSSOe(fullState),
                      'va-blue-button',
                    )}
                    rel="noreferrer"
                  >
                    Go to VA Blue Button&reg; on the My HealtheVet website
                  </a>
                </p>
              </va-accordion-item>
            )}
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
                Or you can send a secure message to your care team and ask them
                to update your records.
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
                Yes. This is a secure website. We follow strict security
                policies and practices to protect your personal health
                information. Only you and your VA care team will have access to
                your records.
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
                Only use messages for non-urgent needs. Your care team may take
                up to{' '}
                <span className="vads-u-font-weight--bold">
                  3 business days
                </span>{' '}
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

            {/*
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What’s new about this medical records tool?
              </h3>
              <p>
                We’re giving the trusted My HealtheVet medical records tool a
                new home here on VA.gov. And we need your feedback to help us
                keep making this tool better for you and all Veterans.
              </p>
              <p>
                Email your feedback and questions to us at <FeedbackEmail />.
              </p>
              <p>
                <span className="vads-u-font-weight--bold">Note: </span>
                You still have access to your medical records on the My
                HealtheVet website. You can go back to that site at any time.{' '}
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
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What if I can’t find all of my medical records?
              </h3>
              <p>
                <span className="vads-u-font-weight--bold">
                  To find recent records,{' '}
                </span>
                check back later. It may take{' '}
                <span className="vads-u-font-weight--bold">36 hours</span> for
                some record to become available online.
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  To find medication records,
                </span>{' '}
                go to your medications list on the MyHealtheVet website.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                  rel="noreferrer"
                >
                  Go back to your medications on the My HealtheVet website
                </a>
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  To find health information you entered yourself,
                </span>{' '}
                go to VA Blue Button&reg; on the My HealtheVet website.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                  rel="noreferrer"
                >
                  Go to VA Blue Button&reg; on the My HealtheVet website
                </a>
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  If you still can’t find what you’re looking for,
                </span>{' '}
                request a copy of your complete medical record from your VA
                health facility. It can take up to{' '}
                <span className="vads-u-font-weight--bold">30 days</span> to get
                your records this way.
              </p>
              <p>
                <a href="/my-health/medical-records">
                  Learn how to get records from your VA health facility.
                </a>
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                How can I add information to my records?
              </h3>
              <p>
                This tool only includes records your VA providers have entered.
                If you want to add information to your records, send a secure
                message to your care team and ask them to add it for you.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'compose-message',
                  )}
                  rel="noreferrer"
                >
                  Compose a message on the My HealtheVet website
                </a>
              </p>
              <p>
                You can also ask your provider to add information to your
                records at your next appointment.
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                How can I share my records with providers?
              </h3>
              <p>
                <span className="vads-u-font-weight--bold">
                  If you go to a VA provider,
                </span>{' '}
                they can access all your VA medical records automatically. You
                don’t need to do anything.
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  If you go to a community care provider in our network,
                </span>{' '}
                we may be able to share your records online.
              </p>
              <p>
                <a href="/resources/the-veterans-health-information-exchange-vhie/">
                  Learn how to manage your sharing settings.
                </a>
              </p>
              <p>
                <span className="vads-u-font-weight--bold">
                  If you go to a provider outside our network,
                </span>{' '}
                you can download all of your medical records as a single file.
                Then you can share them with your provider.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                >
                  Download all your medical records
                </a>
              </p>
            </va-accordion-item>
            */}
          </va-accordion>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
