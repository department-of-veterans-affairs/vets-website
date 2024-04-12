import React from 'react';
import { Link } from 'react-router';

import { SIGN_IN_URL } from '../../../../constants';

const WiderThanMobileLogoRow = () => {
  return (
    <div className="row va-flex usa-grid usa-grid-full va-header-logo-menu">
      <div className="va-header-logo-wrapper">
        <Link data-testid="wider-than-mobile-logo-row-logo-link" to="/">
          <img
            data-testid="wider-than-mobile-logo-row-logo"
            className="arp-logo"
            src="/img/arp-header-logo.png"
            alt="VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs"
          />
        </Link>
      </div>
      <div className="medium-screen:vads-u-display--none usa-grid usa-grid-full">
        <div className="menu-rule usa-one-whole" />
      </div>
      <div className="vet-toolbar">
        <a
          data-testid="wider-than-mobile-logo-row-contact-us-link"
          className="vads-u-color--white vads-u-text-decoration--none vads-u-padding-x--1 vads-u-font-weight--bold"
          href="https://www.va.gov/contact-us/"
        >
          Contact us
        </a>
        <div className="sign-in-nav">
          <div className="sign-in-links">
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
            <a
              data-testid="wider-than-mobile-logo-row-sign-in-link"
              className="usa-button usa-button-primary"
              href={SIGN_IN_URL}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WiderThanMobileLogoRow;
