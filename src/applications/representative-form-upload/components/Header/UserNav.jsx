import React from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import { SIGN_OUT_URL } from '../../constants';
import NavDropdown from './NavDropdown';

const UserHelpLinks = () => {
  return (
    <>
      <Toggler
        toggleName={Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSearch}
      >
        <Toggler.Enabled>
          <li>
            <a
              data-testid="user-nav-poa-search-link"
              className="vads-u-color--white"
              href="/representative/claimant-search"
            >
              <va-icon icon="search" size={2} className="people-search-icon" />
              Find Claimant
            </a>
          </li>
        </Toggler.Enabled>
      </Toggler>
      <li>
        <a
          data-testid="user-nav-poa-requests-link"
          className="vads-u-color--white"
          href="/representative/poa-requests"
        >
          Representation Requests
        </a>
      </li>
      <Toggler
        toggleName={
          Toggler.TOGGLE_NAMES.accreditedRepresentativePortalSubmissions
        }
      >
        <Toggler.Enabled>
          <li>
            <a
              data-testid="submissions-link"
              className="vads-u-color--white"
              href="/representative/submissions"
            >
              Submissions
            </a>
          </li>
        </Toggler.Enabled>
      </Toggler>
      <li className="vads-u-display--none">
        <a
          data-testid="user-nav-profile-link"
          className="vads-u-color--white"
          href="/get-help"
        >
          Get Help
        </a>
      </li>
    </>
  );
};

const UserNavLinks = () => {
  return (
    <>
      <li className="vads-u-display--none">
        <a
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          href="/profile"
        >
          Profile
        </a>
      </li>
      <li>
        <a
          data-testid="user-nav-sign-out-link"
          className="vads-u-color--black"
          href={SIGN_OUT_URL}
        >
          Sign Out
        </a>
      </li>
    </>
  );
};

function UserNav({ profile }) {
  return (
    <>
      <div
        data-testid="desktop-user-nav"
        className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center desktop"
      >
        <NavDropdown
          title="profile dropdown"
          srText="toggle menu"
          icon="account_circle"
          dataTestId="user-nav-user-name"
          className="nav__btn nav__btn--user vads-u-color--base"
          firstName={profile.firstName}
          lastName={profile.lastName}
          secondaryIcon="chevron_left"
          iconClassName="user-nav__chevron"
          view="desktop"
          size={2}
        >
          <UserNavLinks />
        </NavDropdown>
      </div>
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center mobile">
        <NavDropdown
          icon="account_circle"
          secondaryIcon="chevron_left"
          srText="toggle menu"
          className="nav__btn nav__btn--user vads-u-color--base"
          iconClassName="user-nav__chevron"
          dropdownClass="nav__user-menu"
          view="mobile"
          size={3}
        >
          <UserNavLinks />
        </NavDropdown>

        <NavDropdown
          btnText="Menu"
          icon="menu"
          srText="toggle menu"
          dropdownClass="nav__full-width"
          className="nav__btn is--menu"
          closeIcon="close"
          view="mobile"
          size={2}
          data-testid="menu-toggle-dropdown-mobile"
        >
          <UserHelpLinks />
        </NavDropdown>
      </div>
    </>
  );
}

export default UserNav;
