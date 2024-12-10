import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import UserNavLinks from './UserNavLinks';
import NavigationDropdown from './NavigationDropdown';
import {
  selectUserProfile,
  selectIsUserLoading,
} from '../../../selectors/user';
import { SIGN_IN_URL } from '../../../constants';

const UserNav = ({ isMobile }) => {
  const user = useContext(UserContext);
  const profile = user?.profile;
  const isLoading = !profile;

  let content;

  if (isLoading) {
    content = (
      <div className="loading-icon-container">
        <va-loading-indicator
          data-testid="user-nav-loading-icon"
          label="Loading"
        />
      </div>
    );
  } else if (!profile) {
    content = (
      <Link
        data-testid="user-nav-sign-in-link"
        className="usa-button usa-button-primary nav__sign-in"
        to={SIGN_IN_URL}
      >
        Sign in
      </Link>
    );
  } else if (profile && isMobile) {
    content = (
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav">
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
        </NavigationDropdown>
      </div>
    );
  } else if (profile && !isMobile) {
    content = (
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center">
        <Link to="/" className="usa-button nav__user-btn nav__user-btn--user ">
          Get Help
        </Link>
        <NavigationDropdown
          title="profile dropdown"
          srText="toggle menu"
          icon="person"
          className="usa-button nav__user-btn nav__user-btn--user"
          name={`${profile.firstName}${isMobile ? '' : ` ${profile.lastName}`}`}
          secondaryIcon="chevron_left"
          iconClassName="user-nav__chevron"
        >
          <UserNavLinks />
        </NavigationDropdown>
      </div>
    );
  }

  return content;
};

UserNav.propTypes = {
  isMobile: PropTypes.bool,
};

export default UserNav;
