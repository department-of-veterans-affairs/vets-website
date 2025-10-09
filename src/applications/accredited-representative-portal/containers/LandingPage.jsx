import React, { useEffect, useContext } from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import { addStyleToShadowDomOnPages } from '../utilities/poaRequests';
import { ProfileContext } from '../context/ProfileContext';
import { getSignInUrl } from '../utilities/constants';

const LandingPage = title => {
  const user = useContext(ProfileContext);
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-card'],
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );

  return (

                <div className="hp__card vads-grid-col-12  tablet:vads-grid-col-4 desktop-lg:vads-grid-col-3">
                  <va-card icon-name="how_to_reg">
                    <div>
                      <h3>Quickly establish representation</h3>
                      <p className="arp__landing__card-body">
                        Review and accept representation requests from
                        claimants. Within minutes of accepting a request, you’ll
                        have access to the claimant’s eFolder in VBMS.
                      </p>
                    </div>
                  </va-card>
                </div>

                <div className="hp__card vads-grid-col-12  tablet:vads-grid-col-4 desktop-lg:vads-grid-col-3">
                  <va-card icon-name="search">
                    <div>
                      <h3>Find claimants you represent</h3>
                      <p className="arp__landing__card-body">
                        Find claimants you represent and review their contact
                        information and representation status. Start submitting
                        forms on their behalf.
                      </p>
                    </div>
                  </va-card>
                </div>

                <div className="hp__card vads-grid-col-12  tablet:vads-grid-col-4 desktop-lg:vads-grid-col-3">
                  <va-card icon-name="assignment_turned_in">
                    <div>
                      <h3>Submit and track VA forms</h3>
                      <p className="arp__landing__card-body">
                        Submit commonly used VA forms for your claimants and
                        track when they’ve been received in VBMS. Get notified
                        when forms are submitted, received, or need attention.
                      </p>
                    </div>
                  </va-card>
                </div>
              </div>
            </div>

            <div className="hp__container vads-u-background-color--primary-dark">
              <div className="vads-grid-row hp__content hp__content--get-started">
                <div className="vads-grid-col-12 tablet:vads-grid-col-6 desktop-lg:vads-grid-col-6">
                  <img
                    src="/img/arp-hp-card.png"
                    className="hp__img hp__img--portal"
                    alt="poa request search page"
                  />
                </div>
                <div className="vads-grid-col-12 tablet:vads-grid-col-6 desktop-lg:vads-grid-col-5">
                  <div className="vads-u-color--white hp__copy">
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
              </div>

              <div className="vads-grid-row hp__content hp__content--improve">
                <div className="vads-grid-col-12 tablet:vads-grid-col-6 desktop-lg:vads-grid-col-5">
                  <div className="vads-u-color--white hp__copy">
                    <h2>Help improve tools for representatives</h2>
                    <p>
                      Your input is valuable as we work to build the next
                      generation of tools for representatives. If you’d like to
                      give us feedback, sign up to be invited to feedback
                      sessions with the VA research team.
                    </p>
                    <va-link-action
                      class="home__link"
                      type="reverse"
                      href="https://docs.google.com/forms/d/1VvExHYQWsNgSho5zu9nCgF_l7AYFyun-B6-2EHOr8MA/edit?ts=6759c5e9"
                      text="Sign up to be invited to feedback sessions"
                    />
                  </div>
                </div>
                <div className="vads-grid-col-12 tablet:vads-grid-col-6 desktop-lg:vads-grid-col-6">
                  <img
                    src="/img/arp-hp-help-us-improve-experience.jpg"
                    className="hp__img hp__img--portal"
                    alt="poa request search page"
                  />
                </div>
              </div>
            </div>

            <div className="hp__container is--sm-padding">
              <div className="vads-grid-row hp__content hp__content--accreditation">
                <div className="vads-grid-col-12 tablet:vads-grid-col-12 desktop-lg:vads-grid-col-5">
                  <h2>Apply for accreditation</h2>
                </div>
                <div className="vads-grid-col-12  tablet:vads-grid-col-12 desktop-lg:vads-grid-col-7">
                  <p>
                    To apply for accreditation as a VSO representative, claims
                    agent, or attorney, you need to submit an application to the
                    Office of General Counsel.
                  </p>
                  <va-link
                    class="home__link"
                    href="https://www.va.gov/ogc/accreditation.asp"
                    text="Learn more about how to apply for accreditation"
                  />
                </div>
              </div>
            </div>

            <div className="hp__container is--lighter is--sm-padding">
              <div className="vads-grid-row">
                <div className="vads-grid-col-12">
                  <div className="hp__content hp__content--veteran">
                    <h2>Are you a Veteran looking for help with a claim?</h2>
                    <p>
                      An accredited attorney, claims agent, or Veterans Service
                      Organization (VSO) representative can help you file a
                      claim or request a decision review.
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
          </div>
    </section>
  );
};

export default LandingPage;
