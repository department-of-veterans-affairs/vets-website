import React from 'react';
import FeedbackEmail from '../components/shared/FeedbackEmail';

const LandingPage = () => {
  const content = () => {
    return (
      <div className="landing-page">
        <div className="main-content">
          <section>
            <h1>About Medications</h1>
            <p className="vads-u-font-size--h3">
              Learn how to manage your VA prescriptions and review all
              medications in your VA medical records.
            </p>
          </section>
          <section>
            <a
              className="vads-c-action-link--green"
              href="/my-health/medications/prescriptions"
            >
              Go to your medications
            </a>
          </section>
          <section>
            <h2>What to know as you try out this tool</h2>
            <p>
              We’re giving the trusted My HealtheVet pharmacy tool a new home
              here on VA.gov. And we need your feedback to help us keep making
              this tool better for you and all Veterans.
            </p>
            <p>
              Email your feedback and questions to us at <FeedbackEmail />.
            </p>
            <p>
              Note: You still have access to the pharmacy tool on the My
              HealtheVet website. You can go back to that site at any time.{' '}
              <a
                href="/my-health/medications/"
                target="_blank"
                rel="noreferrer"
              >
                Go back to pharmacy on the My HealtheVet website
              </a>
            </p>
          </section>
          <section>
            <h2>Questions about your medical records</h2>
            <va-accordion bordered>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  Does this tool list all my medications and supplies?
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What types of prescriptions can I refill and track in this
                  tool?
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  When will I get my prescriptions, and when should I request a
                  refill?
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  Will VA protect my personal health information?
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What if I have more questions?
                </h3>
              </va-accordion-item>
            </va-accordion>
          </section>
          <section>
            <h2>More ways to manage your medications</h2>
            <p>
              {' '}
              Learn how to renew prescriptions, update your mailing address, and
              review allergies and reactions in your VA medical records.
            </p>
            <va-accordion bordered>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to renew prescriptions
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to confirm or update your mailing address
                </h3>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to review your allergies and reactions
                </h3>
              </va-accordion-item>
            </va-accordion>
          </section>
        </div>
      </div>
    );
  };

  return <div className="vads-u-margin-top--3">{content()}</div>;
};

export default LandingPage;
