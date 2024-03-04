import React from 'react';
import { Link } from 'react-router';

import { SIGN_IN_URL } from '../constants';

const LandingPage = () => {
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
              <h1 className="homepage-hero__welcome-headline vads-u-color--white vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-y--1 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-font-size--lg vads-u-font-family--serif">
                Welcome to Representative.VA.gov
              </h1>
              <h2 className="vads-u-color--white vads-u-margin-top--3 vads-u-font-size--xl small-desktop-screen:vads-u-font-size--2xl">
                Manage power of attorney requests
              </h2>
              <p className="vads-u-color--white vads-u-padding-right--5">
                A system to help you get power of attorney and then support
                Veterans by acting on their behalf.
              </p>
              <Link to="/dashboard" className="vads-c-action-link--white">
                Until sign in is added use this to see dashboard
              </Link>
            </div>
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--6 homepage-hero__container">
            <div className="vads-u-display--flex vads-u-width--full vads-u-align-items--center vars-u-justify-content--center">
              <div className="va-flex vads-u-flex-direction--column vads-u-align-items--flex-start vads-u-background-color--white vads-u-margin-top--6 vads-u-margin-bottom--6 vads-u-padding-x--3 vads-u-padding-y--2 vads-u-width--full homepage-hero__create-account">
                <h2 className="vads-u-font-size--md vads-u-line-height--5 vads-u-color--gray vads-u-margin-top--0 vads-u-padding-right--2 vads-u-font-family--sans vads-u-font-weight--normal">
                  Create an account to start managing power of attorney.
                </h2>
                <a className="usa-button usa-button-primary" href={SIGN_IN_URL}>
                  Sign in or create an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
