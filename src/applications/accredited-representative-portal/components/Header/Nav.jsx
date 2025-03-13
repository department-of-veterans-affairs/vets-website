import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';
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

const mapStateToProps = state => ({
  accreditedRepresentativePortalHelp: toggleValues(state)[
    FEATURE_FLAG_NAMES.accreditedRepresentativePortalHelp
  ],
  accreditedRepresentativePortalProfile: toggleValues(state)[
    FEATURE_FLAG_NAMES.accreditedRepresentativePortalProfile
  ],
});

export const Nav = (
  accreditedRepresentativePortalHelp,
  accreditedRepresentativePortalProfile,
) => {
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
        {profile ? (
          <UserNav
            profile={profile}
            accreditedRepresentativePortalProfile={
              accreditedRepresentativePortalProfile.accreditedRepresentativePortalProfile
            }
            accreditedRepresentativePortalHelp={
              accreditedRepresentativePortalHelp.accreditedRepresentativePortalProfile
            }
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
            {!accreditedRepresentativePortalHelp.accreditedRepresentativePortalHelp && (
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
export default connect(mapStateToProps)(Nav);
