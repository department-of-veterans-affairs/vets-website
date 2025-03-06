import React from 'react';

const LandingPage = () => {
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
              Note: POA requests need to be submitted using the digital{' '}
              <a
                href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"
                target="_blank"
                rel="noreferrer"
              >
                VA Form 21-22 (opens in a new tab)
              </a>
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
            <a
              href="https://www.va.gov/resources/va-accredited-representative-faqs/"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about accredited representatives (opens in a new tab)
            </a>
          </div>

          <va-banner
            data-label="Info banner"
            headline="Get early access to the portal for your organization"
            type="info"
            visible
          >
            <p>
              If you’re a Veterans Service Organization (VSO) manager, you may
              be able to get early access to the portal for your organization by
              joining our test program. Once you start using the portal, we’ll
              ask you to give us feedback on your experience.
            </p>
            <p>
              If you’re interested in having your organization join our test
              program, email us at{' '}
              <a href="mailto:RepresentativePortalHelp@va.gov">
                RepresentativePortalHelp@va.gov
              </a>
              .
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
            <a
              href="https://www.va.gov/get-help-from-accredited-representative/"
              className="home__link"
              target="_blank"
              rel="noreferrer"
            >
              Get help from an accredited representative (opens in a new tab)
            </a>
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
            <a
              href="https://docs.google.com/forms/d/1VvExHYQWsNgSho5zu9nCgF_l7AYFyun-B6-2EHOr8MA/edit?ts=6759c5e9"
              className="home__link"
              target="_blank"
              rel="noreferrer"
            >
              Sign up to participate in feedback sessions (opens in a new tab)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
