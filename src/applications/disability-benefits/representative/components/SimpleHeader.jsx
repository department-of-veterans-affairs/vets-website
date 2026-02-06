import React from 'react';

/**
 * Simplified header for the representative 526EZ form
 * Based on ARP header but without React Router v6 dependencies
 */
const SimpleHeader = () => {
  return (
    <header className="nav">
      <div className="nav__container nav__container-primary vads-u-display--flex">
        <a
          aria-label="VA Accredited Representative Portal"
          className="nav__link vads-u-display--flex"
          href="/representative"
        >
          <img
            className="nav__logo mobile"
            src="/img/va.svg"
            alt="Veteran Affairs"
          />
          <span className="nav__logo-text mobile">
            Accredited Representative Portal
          </span>
          <img
            className="nav__logo nav__logo--desktop desktop"
            src="/img/arp-header-logo-dark.svg"
            alt="VA Accredited Representative Portal, U.S. Department of Veterans Affairs"
          />
        </a>

        <div className="heading-right">
          <a
            href="/representative/help"
            className="usa-button-secondary heading-help-link logged-in"
          >
            Help
          </a>
        </div>
      </div>

      <div className="nav__container-secondary is--displayed">
        <div className="nav__container vads-u-display--flex">
          <a className="nav__btn desktop" href="/representative/find-claimant">
            <va-icon icon="search" size={2} className="people-search-icon" />
            Find Claimant
          </a>
          <a
            className="nav__btn desktop"
            href="/representative/representation-requests"
          >
            Representation Requests
          </a>
          <a
            className="nav__btn is--active desktop"
            href="/representative/submissions"
          >
            Submissions
          </a>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
