import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Toggler } from 'platform/utilities/feature-toggles';
import { getSignInUrl } from '../../utilities/constants';
import UserNav from './UserNav';

function SignInButton() {
  return (
    <a
      data-testid="user-nav-sign-in-link"
      className="nav__btn is--sign-in"
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
        {profile ? <UserNav profile={profile} /> : <SignInButton />}
      </div>

      {profile && (
        <div className="nav__container-secondary" data-testid="desktop-nav-row">
          <div className="nav__container vads-u-display--flex">
            <Toggler
              toggleName={
                Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSearch
              }
            >
              <Toggler.Enabled>
                <Link
                  className="nav__btn desktop"
                  to="/poa-search"
                  data-testid="desktop-search-link"
                >
                  <va-icon
                    icon="search"
                    size={2}
                    className="people-search-icon"
                  />
                  Search People
                </Link>
              </Toggler.Enabled>
            </Toggler>
            <Link
              className="nav__btn desktop"
              to="/poa-requests"
              data-testid="desktop-poa-link"
            >
              Power of Attorney Requests
            </Link>
            <Link
              to="/get-help"
              className="nav__btn desktop vads-u-display--none"
              data-testid="desktop-help-link"
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
