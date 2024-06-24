import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import UserNav from '../common/UserNav';

export const MobileLogoRow = () => {
  return (
    <nav className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
      <div className="header-logo-row vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--1p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
        <Link
          data-testid="mobile-logo-row-logo-link"
          aria-label="VA logo"
          className="header-logo vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center"
          to="/"
        >
          <img
            data-testid="mobile-logo-row-logo"
            className="arp-logo"
            src="/img/arp-header-logo.png"
            alt="VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs"
          />
        </Link>
        <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
          <div className="profile-nav-container">
            <div className="hidden-header vads-u-display--flex vads-u-align-items--center">
              <div className="sign-in-nav">
                <div className="sign-in-links">
                  <UserNav isMobile />
                </div>
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
          <button
            data-testid="mobile-logo-row-menu-button"
            aria-controls="header-nav-items"
            aria-expanded="false"
            className="header-menu-button usa-button vads-u-background-color--gray-lightest vads-u-color--link-default vads-u-padding-y--1 vads-u-padding-x--1p5 vads-u-margin--0 vads-u-margin-left--2 vads-u-position--relative"
            type="button"
          >
            Menu
            <i
              aria-hidden="true"
              className="fa fa-bars vads-u-margin-left--1 vads-u-font-size--sm"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MobileLogoRow;
