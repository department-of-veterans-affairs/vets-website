// Node modules.
import React from 'react';
// Relative imports.
import UserNav from '../../../user-nav/containers/Main';

export const LogoRow = () => {
  return (
    <div className="header-logo-row vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--0p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
      {/* Logo */}
      <a href="/" className="header-logo">
        <img alt="Go to VA.gov" src="/img/header-logo-v2.png" />
      </a>

      <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
        {/* Sign in button */}
        <UserNav isHeaderV2 />

        {/* Mobile menu button */}
        <button
          className="header-menu-button usa-button vads-u-background-color--white vads-u-color--link-default vads-u-padding-y--1 vads-u-padding-x--1p5 vads-u-margin--0 vads-u-margin-left--2"
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
  );
};

export default LogoRow;
