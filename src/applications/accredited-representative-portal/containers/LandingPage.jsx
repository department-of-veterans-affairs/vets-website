import React from 'react';

import { useRouteLoaderData } from 'react-router';
import { getSignInUrl } from '../utilities/constants';

const LandingPage = () => {
  const user = useRouteLoaderData('root');
  const firstName = user && user.profile.firstName;

  return (
    <div className="homepage-hero__wrapper homepage-hero__look-and-feel">
      <div className="vads-l-grid-container vads-u-padding-x--0 homepage-hero">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--6">
            <div
              className="vads-u-padding-left--2 vads-u-padding-right--3 vads-u-padding-top--5
        vads-u-padding-bottom--3
        small-desktop-screen:vads-u-padding-bottom--8"
            >
              <h1
                data-testid="landing-page-heading"
                className="homepage-hero__welcome-headline vads-u-color--white vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-y--1 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-font-size--lg vads-u-font-family--serif"
              >
                Welcome to the Accredited Representative Portal
                {firstName && `, ${firstName}`}
              </h1>
              <h2 className="vads-u-color--white vads-u-margin-top--3 vads-u-font-size--xl desktop:vads-u-font-size--2xl">
                Manage power of attorney requests
              </h2>
              <p className="vads-u-color--white vads-u-padding-right--5">
                A system to help you get power of attorney and then support
                Veterans by acting on their behalf.
              </p>
            </div>
          </div>
          {!user && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--6 homepage-hero__container">
              <div className="vads-u-display--flex vads-u-width--full vads-u-align-items--center vars-u-justify-content--center">
                <div className="va-flex vads-u-flex-direction--column vads-u-align-items--flex-start vads-u-background-color--white vads-u-margin-top--6 vads-u-margin-bottom--6 vads-u-padding-x--3 vads-u-padding-y--2 vads-u-width--full homepage-hero__create-account">
                  <h2
                    className="vads-u-font-size--md vads-u-line-height--5 vads-u-color--gray vads-u-margin-top--0 vads-u-padding-right--2 vads-u-font-family--sans vads-u-font-weight--normal"
                    data-testid="landing-page-create-account-text"
                  >
                    Create an account to start managing power of attorney.
                  </h2>
                  <a
                    data-testid="landing-page-sign-in-link"
                    className="usa-button usa-button-primary"
                    href={getSignInUrl()}
                  >
                    Sign in or create account
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
