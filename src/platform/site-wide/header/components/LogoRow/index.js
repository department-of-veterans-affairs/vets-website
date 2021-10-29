// Node modules.
import React from 'react';

export const LogoRow = () => (
  <div className="vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--0p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
    {/* Logo */}
    <a href="/" className="header-logo">
      <img src="/img/header-logo-v2.png" alt="Go to VA.gov" />
    </a>

    <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
      {/* Sign in button */}
      <button
        className="header-sign-in-button va-button-link vads-u-color--white vads-u-text-decoration--none"
        type="button"
      >
        Sign in
      </button>

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

export default LogoRow;
