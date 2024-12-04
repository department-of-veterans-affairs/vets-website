import React from 'react';

import UserNav from '../common/UserNav';

export const MobileLogoRow = () => {
  return (
    <nav className="mobile-nav vads-u-background-color--primary-darker vads-u-display--flex">
      <a
        data-testid="mobile-logo-row-logo-link"
        aria-label="VA logo"
        className="mobile-nav__link vads-u-display--flex"
        href="/representative"
      >
        <img
          data-testid="mobile-logo-row-logo"
          className="mobile-nav__logo"
          src="/img/va.svg"
          alt=""
        />
        <span className="mobile-nav__logo-text">
          Accredited Representative Portal
        </span>
      </a>
      <UserNav isMobile />
    </nav>
  );
};

export default MobileLogoRow;
