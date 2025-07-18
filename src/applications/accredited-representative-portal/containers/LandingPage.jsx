import React, { useEffect } from 'react';

const LandingPage = title => {
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  return (
    <section className="home">
      <div className="home__hero">
        <div className="home__hero-container">
          <div className="home__hero-bg">
            <h1
              className="home__hero-header"
              data-testid="landing-page-heading"
            >
              Welcome to the Accredited Representative Portal
            </h1>
            <p
              className="home__hero-sub-header"
              data-testid="landing-page-hero-text"
            >
              A secure, user-friendly system that streamlines the power of
              attorney and claims process for representatives and the Veterans
              they support
            </p>
          </div>
        </div>
      </div>
      <div className="home__container">
        <div className="home__content">
          <div className="home__content-copy">
            <h2 data-testid="landing-page-portal-hdr">
              What the portal can do
            </h2>
            <p data-testid="landing-page-portal-text">
              You can use the portal to accept power of attorney (POA) requests
              for any of your accredited organizations. If you have access to
              the Veterans Benefits Management System (VBMS), you’ll be able to
              access a Veteran’s information in VBMS within minutes of accepting
              their POA request in the portal.
            </p>
            <p>
              <strong>Note</strong>: POA requests need to be submitted using the
              online{' '}
              <va-link
                href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"
                text="VA Form 21-22 (on VA.gov)"
              />
              .
            </p>
          </div>
          <div className="home__content-copy">
            <h2 data-testid="landing-page-portal-for-hdr">
              Who the portal is for
            </h2>
            <p data-testid="landing-page-portal-for-text">
              Currently, the portal is only for Veterans Service Organization
              (VSO) representatives who accept POA requests on behalf of their
              organizations. In the future, the portal will support accredited
              VSOs, attorneys, and claims agents.
            </p>
            <va-link
              href="https://www.va.gov/resources/va-accredited-representative-faqs/"
              text="Learn more about accredited representatives"
            />
          </div>

          <va-banner
            data-label="Info banner"
            headline="Stay up-to-date on the portal launch and upcoming features"
            type="info"
            class="home__banner"
            visible
          >
            <p className="home__banner-email">
              We will be opening up the portal to all Veteran Service
              Organizations and their representatives in the coming months. If
              you’re interested in receiving email updates about the portal
              launch and upcoming features, email us at
            </p>
            <va-link
              class="home__link--email"
              href="mailto:RepresentativePortalHelp@va.gov"
              text="RepresentativePortalHelp@va.gov"
            />
            .
            <p>
              If you’re a Veteran Service Organization (VSO) manager and would
              like access to the POA feature for your organization, let us know
              in your email to us.
            </p>
          </va-banner>
        </div>
      </div>
      <div className="home__full-width is--lighter">
        <div className="home__container">
          <div className="home__content">
            <h2 className="home__sub-header">
              Are you a Veteran looking for help with a claim?
            </h2>
            <p>
              An accredited attorney, claims agent, or Veterans Service
              Organization (VSO) representative can help you file a claim or
              request a decision review.
            </p>
            <va-link
              class="home__link"
              href="https://www.va.gov/get-help-from-accredited-representative"
              text="Get help from an accredited representative"
            />
          </div>
        </div>
      </div>

      <div className="home__full-width home__full-width--portal vads-u-background-color--primary">
        <div className="home__container">
          <div className="home__overlay">
            <img
              src="/img/arp-hp-help-us-improve-experience.jpg"
              className="home__portal-img desktop"
              alt="user filling out form"
            />
            <img
              src="/img/arp-hp-hero.jpg"
              className="home__portal-img mobile"
              alt="user filling out form"
            />
          </div>
          <div className="home__content">
            <h2>Help us improve your portal experience</h2>
            <p>
              Your input is valuable and helps us plan future enhancements for
              the portal. If you’d like to give us feedback, you can sign up to
              be invited to future feedback sessions with our VA research team.
            </p>
            <va-link
              class="home__link"
              reverse
              href="https://docs.google.com/forms/d/1VvExHYQWsNgSho5zu9nCgF_l7AYFyun-B6-2EHOr8MA/edit?ts=6759c5e9"
              text="Sign up to participate in feedback sessions"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
