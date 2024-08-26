import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const LandingPageWelcome = ({ firstName = '', children }) => (
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
            <h2 className="vads-u-color--white vads-u-margin-top--3 vads-u-font-size--xl small-desktop-screen:vads-u-font-size--2xl">
              Manage power of attorney requests
            </h2>
            <p className="vads-u-color--white vads-u-padding-right--5">
              A system to help you get power of attorney and then support
              Veterans by acting on their behalf.
            </p>
            <Link
              data-testid="landing-page-bypass-sign-in-link"
              to="/poa-requests"
              className="vads-c-action-link--white"
            >
              Until sign in is added use this to simulate sign in
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

LandingPageWelcome.propTypes = {
  children: PropTypes.node,
  firstName: PropTypes.string,
};

export default LandingPageWelcome;
