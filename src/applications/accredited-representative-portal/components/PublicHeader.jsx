import React from 'react';
import { Link } from 'react-router-dom';
import GovBanner from '~/platform/site-wide/representative/components/header/GovBanner';

const PublicHeader = () => {
  return (
    <header
      data-testid="arp-public-header"
      className="header vads-u-background-color--white"
    >
      <GovBanner />
      <nav className="nav">
        <div className="nav__container nav__container-primary vads-u-display--flex">
          <Link
            data-testid="nav-home-link"
            aria-label="VA Accredited Representative Portal"
            className="nav__link vads-u-display--flex"
            to="/"
          >
            <img
              data-testid="mobile-logo"
              className="nav__logo mobile"
              src="/img/va.svg"
              alt="Veteran Affairs"
            />
            <span className="nav__logo-text mobile">
              Accredited Representative Portal
            </span>
            <img
              data-testid="desktop-logo"
              className="nav__logo nav__logo--desktop desktop"
              src="/img/arp-header-logo-dark.svg"
              alt="VA Accredited Representative Portal, U.S. Department of Veterans Affairs"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default PublicHeader;
