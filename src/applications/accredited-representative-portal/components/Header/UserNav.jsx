import React from 'react';
import { Link } from 'react-router-dom';

import { SIGN_OUT_URL } from '../../utilities/constants';
import NavDropdown from './NavDropdown';

const UserHelpLinks = accreditedRepresentativePortalHelp => {
  return (
    <>
      <li>
        <Link
          data-testid="user-nav-poa-requests-link"
          className="vads-u-color--white"
          to="/poa-requests"
        >
          Power of Attorney Requests
        </Link>
      </li>
      {!accreditedRepresentativePortalHelp && (
        <li>
          <Link
            data-testid="user-nav-profile-link"
            className="vads-u-color--white"
            to="/get-help"
          >
            Get Help
          </Link>
        </li>
      )}
    </>
  );
};

const UserNavLinks = accreditedRepresentativePortalProfile => {
  return (
    <>
      {!accreditedRepresentativePortalProfile && (
        <li>
          <Link
            data-testid="user-nav-profile-link"
            className="vads-u-color--black"
            to="/profile"
          >
            Profile
          </Link>
        </li>
      )}
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

function UserNav({
  profile,
  accreditedRepresentativePortalProfile,
  accreditedRepresentativePortalHelp,
}) {
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
          <UserNavLinks
            accreditedRepresentativePortalProfile={
              accreditedRepresentativePortalProfile
            }
          />
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
          <UserNavLinks
            accreditedRepresentativePortalProfile={
              accreditedRepresentativePortalProfile
            }
          />
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
        >
          <UserHelpLinks
            accreditedRepresentativePortalHelp={
              accreditedRepresentativePortalHelp
            }
          />
        </NavDropdown>
      </div>
    </>
  );
}

export default UserNav;
