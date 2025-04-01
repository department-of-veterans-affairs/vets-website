import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { useSelector } from 'react-redux';
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
  const portalHelp = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.accreditedRepresentativePortalHelp
      ],
  );
  const portalProfile = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.accreditedRepresentativePortalProfile
      ],
  );
  // console.log(portalHelp, portalProfile);
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
        {profile ? (
          <UserNav
            profile={profile}
            accreditedRepresentativePortalProfile={portalProfile}
            accreditedRepresentativePortalHelp={portalHelp}
          />
        ) : (
          <SignInButton />
        )}
      </div>

      {profile && (
        <div className="nav__container-secondary" data-testid="desktop-nav-row">
          <div className="nav__container vads-u-display--flex">
            <Link
              className="nav__btn desktop"
              to="/poa-requests"
              data-testid="desktop-poa-link"
            >
              Power of Attorney Requests
            </Link>
            {!portalHelp && (
              <Link
                to="/get-help"
                className="nav__btn desktop"
                data-testid="desktop-help-link"
              >
                Get Help
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Nav;
