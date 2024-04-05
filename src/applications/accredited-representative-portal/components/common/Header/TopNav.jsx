import React from 'react';

import USAWebsiteHeader from './USAWebsiteHeader';

const TopNav = () => {
  return (
    <div id="legacy-header" className="vads-u-display--none">
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <USAWebsiteHeader />
        </div>
        <div className="va-crisis-line-container vads-u-background-color--secondary-darkest">
          <button
            className="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest"
            data-show="#modal-crisisline"
            onClick="recordEvent({ event: 'nav-crisis-header' })"
          >
            <div className="va-crisis-line-inner">
              <span className="va-crisis-line-icon" aria-hidden="true" />
              <span
                className="va-crisis-line-text"
                onClick="recordEvent({ event: 'nav-jumplink-click' });"
              >
                Talk to the <strong>Veterans Crisis Line</strong> now
              </span>
              <img
                alt=""
                aria-hidden="true"
                className="va-crisis-line-arrow"
                src="/img/arrow-right-white.svg"
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className="row va-flex usa-grid usa-grid-full"
        id="va-header-logo-menu"
      >
        <div className="va-header-logo-wrapper">
          <a href="/" className="va-header-logo">
            <img
              src="/img/header-logo.png"
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
              height="59"
              width="264"
            />
          </a>
        </div>
        <div id="va-nav-controls" />
        <div className="medium-screen:vads-u-display--none usa-grid usa-grid-full">
          <div className="menu-rule usa-one-whole" />
          <div className="mega-menu" id="mega-menu-mobile" />
        </div>
        <div id="login-root" className="vet-toolbar" />
      </div>
      <div className="usa-grid usa-grid-full">
        <div className="menu-rule usa-one-whole" />
        <div className="mega-menu" id="mega-menu" />
      </div>
    </div>
  );
};

export default TopNav;
