import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import UserNav from '../common/UserNav';

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
        <div className="sign-in-nav">
          <div className="sign-in-links">
            <UserNav isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WiderThanMobileLogoRow;
