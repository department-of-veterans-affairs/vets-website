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
        <h1>About VA medical records</h1>
        <p className="vads-u-font-size--h3 set-width">
          Review, print, download, and share your VA medical records with our
          online tool.
        </p>
      </section>
      <div className="set-width">
        <section>
          <h2>Lab and test results</h2>
          <va-link
            active
            href="/my-health/medical-records/labs-and-tests"
            text="Review your lab and test results"
          />
          <p>[Description of section]</p>
        </section>
        <section>
          <h2>Health history</h2>
          <va-link
            active
            href="/my-health/medical-records/health-history"
            text="Review your health history"
          />
          <p>
            [description of allergies; care summaries and notes; health
            conditions; vaccines; vitals]
          </p>
        </section>
        <section>
          <h2>Share your medical record</h2>
          <va-link
            active
            href="/my-health/medical-records/share-your-medical-record"
            text="Review your sharing options"
          />
          <p>[description of Health Summary/Blue Button/VHIE]</p>
        </section>
        <section>
          <h2>What to know as you try out this tool</h2>
          <p>
            We’re giving the trusted My HealtheVet medical records tool a new
            home here on VA.gov. And we need your feedback to help us keep
            making this tool better for you and all Veterans.
          </p>
          <p>
            Email your feedback and questions to us at <FeedbackEmail />.
          </p>
          <p>
            Note: You still have access to your medical records on the My
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
        </section>
        <section>
          <h2>Questions about your medical records</h2>
          <va-accordion bordered>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                How can I add information to my records?
              </h3>
              <p>
                <strong>
                  This tool only includes records your VA providers have
                  entered.
                </strong>{' '}
                If you want to add information to your records, send a message
                to your care team and ask them to add it for you.
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
                  Start a new message
                </a>
              </p>
              <p>
                You can also ask your provider to add information to your
                records at your next appointment.
              </p>
              <p>
                To find information you entered in the past, go back to your
                medical records on the My HealtheVet website.
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
                  Go back to medical records on the My HealtheVet website
                </a>
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What if I can’t access all of my medical records through this
                tool?
              </h3>
              <p>
                <strong>
                  If you need help using this tool to find your records,
                </strong>{' '}
                call the My HealtheVet help desk at{' '}
                <va-telephone contact="8773270022" /> (
                <va-telephone tty contact="8008778339" />
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
              <p>
                <strong>
                  If you can’t access all of your records through this tool,
                </strong>{' '}
                you can request a complete copy of your medical records from
                your VA health facility.
              </p>
              <p>
                <a href="/my-health/medical-records">
                  Learn how to get medical records from your VA health facility
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
                responsibility for protecting that information.
              </p>
            </va-accordion-item>
            <va-accordion-item>
              <h3 className="vads-u-font-size--h6" slot="headline">
                What if I have questions about my records?
              </h3>
              <p>
                <strong>
                  For questions about health information in your records
                </strong>
              </p>
              <p>Send a message to your care team</p>
              <p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'secure-messaging',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Start a new message
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
        <va-back-to-top />
      </div>
    </div>
  );
};

export default LandingPage;
