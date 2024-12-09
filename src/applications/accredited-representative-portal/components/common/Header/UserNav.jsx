import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import UserNavLinks from './UserNavLinks';

import {
  selectUserProfile,
  selectIsUserLoading,
} from '../../../selectors/user';
import { SIGN_IN_URL } from '../../../constants';

const UserNav = ({ isMobile }) => {
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsUserLoading);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef([]);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  useEffect(
    () => {
      const handleClickOutside = event => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [isDropdownOpen],
  );

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
        <div className="va-dropdown" ref={dropdownRef}>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            data-testid="user-nav-dropdown-panel-button"
            className="usa-button usa-button-secondary nav__user-btn nav__user-btn--menu"
            aria-controls="menu-dropdown"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
            type="button"
          >
            Menu
            <va-icon
              icon="menu"
              size={2}
              srtext="toggle menu"
              class="nav__user-btn-icon"
            />
          </button>
          <div
            className={`va-dropdown-panel ${isDropdownOpen ? '' : 'hidden'}`}
            id="menu-dropdown"
          >
            <ul className="nav__user-list">
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
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (profile && !isMobile) {
    content = (
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center">
        <Link to="/" className="usa-button nav__user-btn nav__user-btn--user ">
          Get Help
        </Link>
        <div className="va-dropdown" ref={dropdownRef}>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            data-testid="user-nav-dropdown-panel-button"
            className="usa-button nav__user-btn nav__user-btn--user"
            aria-controls="dropdown"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
            type="button"
          >
            <va-icon
              icon="person"
              size={2}
              srtext="profile dropdown"
              data-testid="menu-login"
            />
            <div
              data-testid="user-nav-user-name"
              className="user-dropdown-email"
              data-dd-privacy="mask"
              data-dd-action-name="First Name"
            >
              {`${profile.firstName}${isMobile ? '' : ` ${profile.lastName}`}`}
            </div>
            <va-icon
              icon="chevron_left"
              size={2}
              srtext="profile dropdown"
              data-testid="menu-user-dropdown"
              class="user-nav__chevron"
            />
          </button>
          <div
            className={`va-dropdown-panel ${isDropdownOpen ? '' : 'hidden'}`}
            id="dropdown"
          >
            <UserNavLinks />
          </div>
        </div>
      </div>
    );
  }

  return content;
};

UserNav.propTypes = {
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default UserNav;
