import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { getSignInUrl } from '../../utilities/constants';
import UserNav from './UserNav';

function SignInButton() {
  return (
    <a
      data-testid="user-nav-sign-in-link"
      className="nav__btn"
      href={getSignInUrl()}
    >
      Sign in
    </a>
  );
}

export const Nav = () => {
  const profile = useLoaderData()?.profile;

  return (
    <nav className="nav">
      <div className="nav__container nav__container-primary vads-u-display--flex">
        <Link
          data-testid="nav-home-link"
          aria-label="VA logo"
          className="nav__link vads-u-display--flex"
          to="/"
        >
          <img
            data-testid="mobile-logo"
            className="nav__logo mobile"
            src="/img/va.svg"
            alt="Veteran Affairs logo"
          />
          <span className="nav__logo-text mobile">
            Accredited Representative Portal
          </span>
          <img
            data-testid="desktop-logo"
            className="nav__logo nav__logo--desktop desktop"
            src="/img/arp-header-logo-dark.svg"
            alt="VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs"
          />
        </Link>
        {profile ? <UserNav profile={profile} /> : <SignInButton />}
      </div>

      {profile && (
        <div className="nav__container-secondary">
          <div className="nav__container vads-u-display--flex">
            <Link className="nav__btn desktop" to="/poa-requests">
              Power of Attorney Requests
            </Link>
            <Link
              to="/get-help"
              className="nav__btn desktop vads-u-display--none"
            >
              Get Help
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
