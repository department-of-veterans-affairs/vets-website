import React, { useEffect, useRef } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import DemoModeBanner from '../components/DemoModeBanner';

const MhvDemoMedicalRecordsLandingPage = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      focusElement(headingRef.current);
    }, 400);
  }, []);

  // In demo mode, links are non-functional but visible
  const handleLinkClick = (event, label) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log(`[Demo Mode] Navigation clicked: ${label}`);
  };

  return (
    <>
      <DemoModeBanner />
      <MhvSecondaryNav />
      <div className="vads-l-grid-container vads-u-padding-left--2">
        <VaBreadcrumbs
          homeVeteransAffairs
          breadcrumbList={[
            { label: 'VA.gov home', href: '/' },
            {
              label: 'My HealtheVet',
              href: '/sign-in/mhv-demo-mode-landing-page',
            },
            {
              label: 'Medical records',
              href: '/sign-in/mhv-demo-mode-medical-records',
            },
          ]}
        />
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--8">
            <div className="landing-page">
              <section className="vads-u-margin-bottom--2">
                <h1
                  ref={headingRef}
                  className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                  data-testid="mr-landing-page-title"
                >
                  Medical records
                </h1>
                <p className="va-introtext vads-u-margin-bottom--0">
                  Review, print, and download your VA medical records. Tell your
                  provider about any changes in your health at each appointment.
                </p>
              </section>

              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Lab and test results
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Get results of your VA medical tests. This includes blood
                  tests, X-rays, and other imaging tests.
                </p>
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/labs-and-tests"
                  data-testid="labs-and-tests-landing-page-link"
                  text="Go to your lab and test results"
                  onClick={e => handleLinkClick(e, 'Lab and test results')}
                />
              </section>

              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Care summaries and notes
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Get notes from your VA providers about your health and health
                  care. This includes summaries of your stays in health
                  facilities (called admission and discharge summaries).
                </p>
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/summaries-and-notes"
                  data-testid="notes-landing-page-link"
                  text="Go to your care summaries and notes"
                  onClick={e => handleLinkClick(e, 'Care summaries and notes')}
                />
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
                  text="Go to your vaccines"
                  onClick={e => handleLinkClick(e, 'Vaccines')}
                />
              </section>

              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Allergies and reactions
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Get a list of all allergies, reactions, and side effects in
                  your VA medical records. This includes medication side effects
                  (also called adverse drug reactions).
                </p>
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/allergies"
                  data-testid="allergies-landing-page-link"
                  text="Go to your allergies and reactions"
                  onClick={e => handleLinkClick(e, 'Allergies and reactions')}
                />
              </section>

              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Health conditions
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Get a list of health conditions your VA providers are helping
                  you manage.
                </p>
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/conditions"
                  data-testid="conditions-landing-page-link"
                  text="Go to your health conditions"
                  onClick={e => handleLinkClick(e, 'Health conditions')}
                />
              </section>

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
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/vitals"
                  data-testid="vitals-landing-page-link"
                  text="Go to your vitals"
                  onClick={e => handleLinkClick(e, 'Vitals')}
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
                <p className="vads-u-margin-bottom--2">
                  <va-link-action
                    type="secondary"
                    href="/my-health/medical-records/download"
                    data-testid="go-to-download-mr-reports"
                    text="Go to download your medical records reports"
                    onClick={e =>
                      handleLinkClick(e, 'Download medical records')
                    }
                  />
                </p>
              </section>

              <section className="vads-u-padding-bottom--3">
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  What to do if you can’t find your medical records
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Some of your medical records may not be available on VA.gov
                  right now. If you need to access your records and can’t find
                  them here, you can submit a medical records request. You can
                  submit your request by secure message, by mail, by fax, or in
                  person at your VA health facility.
                </p>
                <va-link-action
                  type="secondary"
                  href="/resources/how-to-get-your-medical-records-from-your-va-health-facility/"
                  data-testid="gps-landing-page-link"
                  text="Learn more about submitting a medical records request"
                  onClick={e => handleLinkClick(e, 'Medical records request')}
                />
              </section>

              <section className="vads-u-padding-bottom--3">
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Manage your electronic sharing settings
                </h2>
                <p className="vads-u-margin-bottom--2">
                  Review and update your medical records sharing and
                  notification settings.
                </p>
                <va-link-action
                  type="secondary"
                  href="/my-health/medical-records/settings"
                  data-testid="settings-landing-page-link"
                  text="Go to manage your electronic sharing settings"
                  onClick={e => handleLinkClick(e, 'Sharing settings')}
                />
              </section>

              <section className="vads-u-padding-bottom--3">
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
                  Share personal health data with your care team
                </h2>
                <p className="vads-u-margin-bottom--2">
                  You can share your personal health data with your care team
                  using the Share My Health Data website.
                </p>
                <va-link
                  href="https://veteran.apps-staging.va.gov/smhdWeb"
                  text="Go to the Share My Health Data website"
                  data-testid="health-data-landing-page-link"
                  onClick={e => handleLinkClick(e, 'Share My Health Data')}
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
                  onClick={e =>
                    handleLinkClick(e, 'Learn more about medical records')
                  }
                />
                <p>
                  Have questions about health information in your records? Send
                  a secure message to your care team.
                </p>
                <va-link
                  href="/my-health/secure-messages/new-message/"
                  text="Start a new message"
                  onClick={e => handleLinkClick(e, 'Start a new message')}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MhvDemoMedicalRecordsLandingPage;
