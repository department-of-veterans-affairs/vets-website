import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const LandingPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([{ url: '/my-health', label: 'Dashboard' }], {
          url: '/my-health/medical-records',
          label: 'About medical records',
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="landing-page">
      <section>
        <h1>Medical records</h1>
        <p className="va-introtext">
          Review, print, download, and share your VA medical records with our
          online tool.
        </p>
      </section>
      <div className="set-width-486">
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
            href="/my-health/medical-records/health-history/care-summaries-and-notes"
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
            Vaccines
          </h2>
          <p className="vads-u-margin-top--1">
            Get a list of all vaccines (immunizations) in your VA medical
            records.
          </p>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/health-history/vaccines"
            text="Go to your vaccines"
            data-testid="section-link"
          />
        </section>
        <section>
          <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
            Allergies
          </h2>
          <p className="vads-u-margin-top--1">
            Get a list of all allergies, reactions, and side effects in your VA
            medical records.
          </p>
          <va-link
            className="section-link"
            active
            href="/my-health/medical-records/health-history/allergies"
            text="Go to your allergies"
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
            href="/my-health/medical-records/health-history/health-conditions"
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
            href="/my-health/medical-records/health-history/vitals"
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

        <section>
          <h2>Questions about this medical records tool</h2>
          <va-accordion bordered>
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
                <strong>Note: </strong>
                You still have access to your medical records on the My
                HealtheVet website. You can go back to that site at any time.{' '}
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                  target="_blank"
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
                <strong>To find recent records, </strong>
                check back later. It may take <strong>36 hours</strong> for some
                reecord to become available online.
              </p>
              <p>
                <strong>To find medication records,</strong> go to your
                medications list on the MyHealtheVet website.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Go back to your medications on the My HealtheVet website
                </a>
              </p>
              <p>
                <strong>
                  To find health information you entered yourself,
                </strong>{' '}
                go to VA Blue Button on the My HealtheVet website.
              </p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'download-my-data',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to VA Blue Button on the My HealtheVet website
                </a>
              </p>
              <p>
                <strong>
                  If you still can’t find what you’re looking for,
                </strong>{' '}
                request a copy of your complete medical record from your VA
                health facility. It can take up to <strong>30 days</strong> to
                get your records this way.
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
                    'secure-messaging',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Compose a message
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
                <strong>If you go to a VA provider,</strong> they can access all
                your VA medical records automatically. You don’t need to do
                anything.
              </p>
              <p>
                <strong>
                  If you go to a community care provider in our network,
                </strong>{' '}
                we may be able to share your records online.
              </p>
              <p>
                <a href="/resources/the-veterans-health-information-exchange-vhie/">
                  Learn how to manage your sharing settings.
                </a>
              </p>
              <p>
                <strong>If you go to a provider outside our network,</strong>{' '}
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
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                Will VA protect my personal health information?
              </h3>
              <p>
                Yes. This is a secure website. We follow strict security
                policies and practices to protect your personal health
                information. Only you and your VA care team will have access to
                your records.
              </p>
              <p>
                If you print or download any records, you’ll need to take
                responsibility for protecting that information. If you’re on a
                public or shared computer, remember that downloading will save a
                copy of your records to that computer.
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What if I have more questions?
              </h3>
              <p>
                <strong>
                  For questions about health information in your records
                </strong>
              </p>
              <p>Send a secure message to your care team.</p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'secure-messaging',
                  )}
                >
                  Compose a message
                </a>
              </p>
              <p>
                Only use messages for non-urgent needs. Your care team may take
                up to <strong>3 business days</strong> to reply.
              </p>
              <p>
                If you need help sooner, use one of these urgent communication
                options:
              </p>
              <ul>
                <li>
                  <strong>
                    If you’re in crisis or having thoughts of suicide,
                  </strong>{' '}
                  connect with our Veterans Crisis Line. We offer confidential
                  support anytime, day or night.
                  <p
                    className="va-overlay-trigger vads-u-text-decoration--underline vads-u-color--link-default vads-u-margin-x--0p5"
                    data-show="#modal-crisisline"
                  >
                    Connect with the Veterans Crisis Line
                  </p>
                </li>
                <li>
                  <strong>
                    If you think your life or health is in danger,
                  </strong>{' '}
                  call <va-telephone contact="911" /> or go to the nearest
                  emergency room.
                </li>
              </ul>
              <p>
                <strong>For questions about how to use this tool</strong>
              </p>
              <p>
                Call the My HealtheVet help desk at{' '}
                <va-telephone contact="8773270022" /> (
                <va-telephone contact="8008778339" tty />
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
            </va-accordion-item>
          </va-accordion>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
