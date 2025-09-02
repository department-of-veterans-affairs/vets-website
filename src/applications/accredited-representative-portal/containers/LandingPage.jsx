import React, { useEffect, useContext } from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import { addStyleToShadowDomOnPages } from '../utilities/poaRequests';
import { getSignInUrl } from '../utilities/constants';
import { profileUser } from '../components/Header/Nav';

const LandingPage = title => {
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-card'],
      '.home__card, va-card {margin-left: 24px;max-width: 228px;}',
    );
  });

  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  const user = useContext(profileUser);
  return (
    <section className="home">
      <Toggler
        toggleName={Toggler.TOGGLE_NAMES.accreditedRepresentativePortalHomePage}
      >
        <Toggler.Enabled>
          <div className="is--redesign">
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
                    A secure, user-friendly system that streamlines the claims
                    process for representatives and their claimants
                  </p>
                </div>

                <div
                  className={`home__hero-bg home__hero-bg--login ${user?.verified &&
                    'vads-u-display--none'}`}
                >
                  <p className="home__hero-sub-header--login">
                    Create an account if you are a VA accredited representative
                  </p>
                  <a className="home__login" href={getSignInUrl()}>
                    Sign in or create an account
                  </a>
                </div>
              </div>
            </div>
            <div className="home__full-width is--lighter">
              <div className="home__container">
                <div className=" home__content home__content--desktop-row home__content--portal">
                  <div className="home__content-copy">
                    <h2 data-testid="landing-page-portal-hdr">
                      What you can do in the portal
                    </h2>
                    <Toggler
                      toggleName={
                        Toggler.TOGGLE_NAMES.accreditedRepresentativePortalHelp
                      }
                    >
                      <Toggler.Enabled>
                        <va-link
                          class="arp__home__link--learn-more"
                          href="/representative/get-help"
                          text="Learn more about the portal"
                        />
                      </Toggler.Enabled>
                    </Toggler>
                    <va-link
                      href="https://www.va.gov"
                      text="Watch a video of how the portal works"
                      video
                    />
                  </div>
                  <ul>
                    <li>
                      <va-card className="home__card" icon-name="how_to_reg">
                        <div>
                          <h3>Quickly establish representation</h3>
                          <p className="arp__landing__card-body">
                            Review and accept representation requests from
                            claimants. Within minutes of accepting a request,
                            you’ll have access to the claimant’s eFolder in
                            VBMS.
                          </p>
                        </div>
                      </va-card>
                    </li>
                    <li>
                      {' '}
                      <va-card className="home__card" icon-name="search">
                        <div>
                          <h3>Find claimants you represent</h3>
                          <p className="arp__landing__card-body">
                            Find claimants you represent and review their
                            contact information and representation status. Start
                            submitting forms on their behalf.
                            <br />
                            <br />
                          </p>
                        </div>
                      </va-card>
                    </li>
                    <li>
                      <va-card
                        className="home__card"
                        icon-name="assignment_turned_in"
                      >
                        <div>
                          <h3>Submit and track VA forms</h3>
                          <p className="arp__landing__card-body">
                            Submit commonly used VA forms for your claimants and
                            track when they’ve been received in VBMS. Get
                            notified when forms are submitted, received, or need
                            attention.
                          </p>
                        </div>
                      </va-card>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="home__full-width home__full-width--portal vads-u-background-color--primary-dark">
              <div className="home__container home__container--portal">
                <img
                  src="/img/arp-hp-card.png"
                  className="home__portal-img is--left-img"
                  alt="poa request search page"
                />

                <div className="home__content vads-u-color--white">
                  <h2>Get started using the portal</h2>
                  <p>
                    To use the portal, you need to be a VA accredited Veterans
                    Service Organization (VSO) representative, attorney, or
                    claims agent. You also need a VA-approved, sign-in account
                    that’s associated with the email you have on file with the
                    Office of General Council (OGC).
                  </p>
                  <va-link
                    class="home__link"
                    reverse
                    href="/representative/get-help"
                    text="Learn more about how to set up your account"
                  />
                  <p>
                    If you are a VSO manager and would like the representation
                    requests feature for your organization, email us at{' '}
                    <va-link
                      class="home__link home__link--email"
                      reverse
                      href="mailto:RepresentativePortalHelp@va.gov"
                      text="RepresentativePortalHelp@va.gov"
                    />
                    .
                  </p>
                </div>
              </div>
              <div className="home__container">
                <div className="home__content vads-u-color--white">
                  <h2>Help improve tools for representatives</h2>
                  <p>
                    Your input is valuable as we work to build the next
                    generation of tools for representatives. If you’d like to
                    give us feedback, sign up to be invited to feedback sessions
                    with the VA research team.
                  </p>
                  <va-link-action
                    class="home__link"
                    type="reverse"
                    href="https://docs.google.com/forms/d/1VvExHYQWsNgSho5zu9nCgF_l7AYFyun-B6-2EHOr8MA/edit?ts=6759c5e9"
                    text="Sign up to be invited to feedback sessions"
                  />
                </div>
                <img
                  src="/img/arp-hp-help-us-improve-experience.jpg"
                  className="home__portal-img is--right-img"
                  alt="user filling out form"
                />
              </div>
            </div>

            <div className="home__full-width is--small-padding">
              <div className="home__container">
                <div className="home__content home__content--desktop-row home__content--accreditation">
                  <div className="home__col">
                    <h2>Apply for accreditation</h2>
                  </div>
                  <div className="home__col">
                    <p>
                      To apply for accreditation as a VSO representative, claims
                      agent, or attorney, you need to submit an application to
                      the Office of General Counsel.
                    </p>
                    <va-link
                      class="home__link"
                      href="https://www.va.gov/ogc/accreditation.asp"
                      text="Learn more about how to apply for accreditation"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="home__full-width is--small-padding is--lighter">
              <div className="home__container">
                <div className="home__content home__content--veteran">
                  <h2>Are you a Veteran looking for help with a claim?</h2>
                  <p>
                    An accredited attorney, claims agent, or Veterans Service
                    Organization (VSO) representative can help you file a claim
                    or request a decision review.
                  </p>
                  <va-link
                    class="home__link"
                    href="https://www.va.gov/get-help-from-accredited-representative"
                    text="Get help from an accredited representative"
                  />
                </div>
              </div>
            </div>
          </div>
        </Toggler.Enabled>
        {/* old homepage design */}
        <Toggler.Disabled>
          <>
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
                    attorney and claims process for representatives and the
                    Veterans they support
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
                    You can use the portal to accept power of attorney (POA)
                    requests for any of your accredited organizations. If you
                    have access to the Veterans Benefits Management System
                    (VBMS), you’ll be able to access a Veteran’s information in
                    VBMS within minutes of accepting their POA request in the
                    portal.
                  </p>
                  <p>
                    <strong>Note</strong>: POA requests need to be submitted
                    using the online{' '}
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
                    Currently, the portal is only for Veterans Service
                    Organization (VSO) representatives who accept POA requests
                    on behalf of their organizations. In the future, the portal
                    will support accredited VSOs, attorneys, and claims agents.
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
                    Organizations and their representatives in the coming
                    months. If you’re interested in receiving email updates
                    about the portal launch and upcoming features, email us at
                  </p>
                  <va-link
                    class="home__link--email"
                    href="mailto:RepresentativePortalHelp@va.gov"
                    text="RepresentativePortalHelp@va.gov"
                  />
                  .
                  <p>
                    If you’re a Veteran Service Organization (VSO) manager and
                    would like access to the POA feature for your organization,
                    let us know in your email to us.
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
                    Organization (VSO) representative can help you file a claim
                    or request a decision review.
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
                    Your input is valuable and helps us plan future enhancements
                    for the portal. If you’d like to give us feedback, you can
                    sign up to be invited to future feedback sessions with our
                    VA research team.
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
          </>
        </Toggler.Disabled>
      </Toggler>
    </section>
  );
};

export default LandingPage;
