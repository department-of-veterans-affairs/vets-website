import React from 'react';
import PropTypes from 'prop-types';
import UserNavLinks from './UserNavLinks';
import UserHelpLinks from './UserHelpLinks';
import NavigationDropdown from './NavigationDropdown';
import { SIGN_IN_URL } from '../../../constants';

const UserNav = ({ profile, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading-icon-container">
        <va-loading-indicator
          data-testid="user-nav-loading-icon"
          label="Loading"
        />
      </div>
    );
  }

  return (
    <>
      {profile ? (
        <>
          <div
            data-test-id="desktop-user-nav"
            className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center desktop"
          >
            <NavigationDropdown
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
            </NavigationDropdown>
          </div>
          <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center mobile">
            <NavigationDropdown
              icon="person"
              srText="toggle menu"
              className="usa-button usa-button-secondary nav__user-btn nav__user-btn--user vads-u-color--white"
            >
              <UserNavLinks />
            </NavigationDropdown>

            <NavigationDropdown
              btnText="Menu"
              icon="menu"
              srText="toggle menu"
              className="usa-button usa-button-secondary nav__user-btn nav__user-btn--menu"
            >
              <UserHelpLinks />
            </NavigationDropdown>
          </div>
        </>
      ) : (
        <a
          data-testid="user-nav-sign-in-link"
          className="usa-button usa-button-primary nav__sign-in"
          href={SIGN_IN_URL}
        >
          Sign in
        </a>
      )}
    </>
  );
};

UserNav.propTypes = {
  isLoading: PropTypes.bool,
  profile: PropTypes.string,
};

export default UserNav;
