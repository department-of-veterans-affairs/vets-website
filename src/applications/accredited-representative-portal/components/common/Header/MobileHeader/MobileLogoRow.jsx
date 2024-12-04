import React from 'react';

import UserNav from '../common/UserNav';

export const MobileLogoRow = () => {
  return (
    <nav className="nav vads-u-background-color--primary-darker ">
      <div className="nav__container vads-u-display--flex">
        <a
          data-testid="mobile-logo-row-logo-link"
          aria-label="VA logo"
          className="nav__link vads-u-display--flex"
          href="/representative"
        >
          <img
            data-testid="mobile-logo-row-logo"
            className="nav__logo mobile"
            src="/img/va.svg"
            alt=""
          />
          <span className="nav__logo-text mobile">
            Accredited Representative Portal
          </span>
          <img
            data-testid="wider-than-mobile-logo-row-logo"
            className="nav__logo nav__logo--desktop desktop"
            src="/img/arp-header-logo.png"
            alt="VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs"
          />
        </a>
        <UserNav isMobile />
        <span aria-hidden="true" className="nav__decorator" />
      </div>
    </nav>
  );
};

export default MobileLogoRow;
