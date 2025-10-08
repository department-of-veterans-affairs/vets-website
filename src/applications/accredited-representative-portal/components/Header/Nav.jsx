import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { recordDatalayerEvent } from '../../utilities/analytics';
import { getSignInUrl } from '../../utilities/constants';
import DropdownContainer from './DropdownContainer';

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
  const [navHidden, isNavHidden] = useState('');
  const profile = useLoaderData()?.profile;

  useEffect(() => {
    const isAuthorized = localStorage.getItem('userAuthorized');
    isNavHidden(isAuthorized);
  }, []);
  return (
    <nav className="nav">
      <div className="nav__container nav__container-primary vads-u-display--flex">
        <Link
          data-testid="nav-home-link"
          aria-label="VA Accredited Representative Portal"
          className="nav__link vads-u-display--flex"
          to="/"
          onClick={recordDatalayerEvent}
          data-eventname="nav-link-click"
        >
          <img
            data-testid="mobile-logo"
            className="nav__logo mobile"
            src="/img/va.svg"
            alt="Veteran Affairs"
            data-eventname="nav-link-click"
          />
          <span className="nav__logo-text mobile">
            Accredited Representative Portal
          </span>
          <img
            data-eventname="nav-link-click"
            data-testid="desktop-logo"
            className="nav__logo nav__logo--desktop desktop"
            src="/img/arp-header-logo-dark.svg"
            alt="VA Accredited Representative Portal, U.S. Department of Veterans Affairs"
          />
        </Link>

        <div className="heading-right">
          <va-button
            to="/get-help"
            className="heading-help-link {ConditionalExpression}"
            variant="secondary"
            text="Help"
            data-testid="heading-help-link"
            onClick={recordDatalayerEvent}
            data-eventname="nav-link-click"
          />
          {profile ? <DropdownContainer rep={profile} /> : <SignInButton />}
        </div>
      </div>

      {/* hidden if unauthorized */}
      {profile && (
        <div
          className={`nav__container-secondary ${
            navHidden === 'false' ? 'vads-u-display--none' : 'is--displayed'
          }`}
          data-testid="desktop-nav-row"
        >
          <div className="nav__container vads-u-display--flex">
            <Link
              className="nav__btn desktop"
              to="/claimant-search"
              data-testid="desktop-search-link"
              onClick={recordDatalayerEvent}
              data-eventname="nav-link-click"
            >
              <va-icon icon="search" size={2} className="people-search-icon" />
              Find Claimant
            </Link>
            <Link
              className="nav__btn desktop"
              to="/poa-requests"
              data-testid="desktop-poa-link"
              onClick={recordDatalayerEvent}
              data-eventname="nav-link-click"
            >
              Representation Requests
            </Link>
            <Link
              className="nav__btn desktop"
              to="/submissions"
              data-testid="desktop-search-link"
            >
              Submissions
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
