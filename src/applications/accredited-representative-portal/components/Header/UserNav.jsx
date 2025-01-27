import React from 'react';
import { Link } from 'react-router-dom';

import { SIGN_OUT_URL } from '../../utilities/constants';
import NavDropdown from './NavDropdown';

const UserHelpLinks = () => {
  return (
    <>
      <li>
        <Link
          data-testid="user-nav-poa-requests-link"
          className="vads-u-color--black"
          to="/poa-requests"
        >
          POA Requests
        </Link>
      </li>
      <li>
        <Link
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          to="/get-help"
        >
          Get Help
        </Link>
      </li>
    </>
  );
};

const UserNavLinks = () => {
  return (
    <ul className="nav__user-list">
      <li>
        <Link
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          to="/profile"
        >
          Profile
        </Link>
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
    </ul>
  );
};

function UserNav({ profile }) {
  return (
    <>
      <div
        data-test-id="desktop-user-nav"
        className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center desktop"
      >
        <NavDropdown
          title="profile dropdown"
          srText="toggle menu"
          icon="person"
          dataTestId="user-nav-user-name"
          className="usa-button nav__user-btn nav__user-btn--user"
          name={`${profile.firstName} ${profile.lastName}`}
          secondaryIcon="chevron_left"
          iconClassName="user-nav__chevron"
        >
          <UserNavLinks />
        </NavDropdown>
      </div>
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center mobile">
        <NavDropdown
          icon="person"
          srText="toggle menu"
          className="usa-button usa-button-secondary nav__user-btn nav__user-btn--user vads-u-color--white"
        >
          <UserNavLinks />
        </NavDropdown>

        <NavDropdown
          btnText="Menu"
          icon="menu"
          srText="toggle menu"
          className="usa-button usa-button-secondary nav__user-btn nav__user-btn--menu"
        >
          <UserHelpLinks />
        </NavDropdown>
      </div>
    </>
  );
}

export default UserNav;
