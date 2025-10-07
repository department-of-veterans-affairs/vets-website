import React from 'react';
import { useSelector } from 'react-redux';
import { Toggler } from 'platform/utilities/feature-toggles';
import DropdownContainer from './DropdownContainer';
import { SIGN_IN_URL } from '../../constants';
import { selectUserProfile } from '../../selectors/user';

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
        </a>
        <div className="heading-right">
          <a
            href="/representative/get-help"
            className={`usa-button-secondary heading-help-link ${
              profile ? 'logged-in' : ''
            }`}
            data-testid="heading-help-link"
            data-eventname="nav-link-click"
          >
            Help
          </a>

          {profile ? <DropdownContainer profile={profile} /> : <SignInButton />}
        </div>
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
                  href="/representative/claimant-search"
                  data-testid="desktop-search-link"
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
              href="/representative/representation-requests"
              data-testid="desktop-poa-link"
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
                  href="/representative/submissions"
                  data-testid="desktop-submissions-link"
                >
                  Submissions
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
