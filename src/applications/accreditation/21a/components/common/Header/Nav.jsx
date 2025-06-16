import React from 'react';
import { useSelector } from 'react-redux';
import { Toggler } from 'platform/utilities/feature-toggles';
import { SIGN_IN_URL } from '../../../constants';
import UserNav from './UserNav';
import { selectUserProfile } from '../../../selectors/user';

function SignInButton() {
  return (
    <a
      data-testid="user-nav-sign-in-link"
      className="nav__btn is--sign-in"
      href={SIGN_IN_URL}
    >
      Sign in
    </a>
  );
}

export const Nav = () => {
  const profile = useSelector(selectUserProfile);

  return (
    <nav className="nav">
      <div className="nav__container nav__container-primary vads-u-display--flex">
        <a
          data-testid="nav-home-link"
          aria-label="VA Accredited Representative Portal"
          className="nav__link vads-u-display--flex"
          href="/"
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
        </a>
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
                <a
                  className="nav__btn desktop"
                  href="/poa-search"
                  data-testid="desktop-search-link"
                  data-eventname="nav-link-click"
                >
                  <va-icon
                    icon="search"
                    size={2}
                    className="people-search-icon"
                  />
                  Find Claimant
                </a>
              </Toggler.Enabled>
            </Toggler>
            <a
              className="nav__btn desktop"
              href="/poa-requests"
              data-testid="desktop-poa-link"
              data-eventname="nav-link-click"
            >
              Representation Requests
            </a>
            <Toggler
              toggleName={
                Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSubmissions
              }
            >
              <Toggler.Enabled>
                <a
                  className="nav__btn desktop"
                  href="/submissions"
                  data-testid="desktop-search-link"
                >
                  Submissions
                </a>
              </Toggler.Enabled>
            </Toggler>
            <Toggler
              toggleName={
                Toggler.TOGGLE_NAMES.accreditedRepresentativePortalHelp
              }
            >
              <Toggler.Enabled>
                <a
                  href="/get-help"
                  className="nav__btn desktop"
                  data-testid="desktop-help-link"
                  data-eventname="nav-link-click"
                >
                  Get Help
                </a>
              </Toggler.Enabled>
            </Toggler>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
