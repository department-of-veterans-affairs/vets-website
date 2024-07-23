import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../constants';
import {
  selectUserProfile,
  selectUserIsLoading,
} from '../../../../selectors/user';

const generateUniqueId = () =>
  `account-menu-${Math.random()
    .toString(36)
    .substring(2, 11)}`;

const UserNav = ({ isMobile }) => {
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserIsLoading);
  const uniqueId = useRef(generateUniqueId());

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          message="Loading"
        />
      </div>
    );
  } else if (!profile && isMobile) {
    content = (
      <a
        href={SIGN_IN_URL}
        data-testid="user-nav-mobile-sign-in-link"
        className="sign-in-link"
      >
        Sign in
      </a>
    );
  } else if (!profile && !isMobile) {
    content = (
      <a
        data-testid="user-nav-wider-than-mobile-sign-in-link"
        className="usa-button usa-button-primary"
        href={SIGN_IN_URL}
      >
        Sign in
      </a>
    );
  } else if (profile) {
    content = (
      <div className="va-dropdown" ref={dropdownRef}>
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          data-testid="user-nav-dropdown-panel-button"
          className="sign-in-drop-down-panel-button va-btn-withicon va-dropdown-trigger"
          aria-controls={uniqueId.current}
          aria-expanded={isDropdownOpen}
          onClick={toggleDropdown}
          type="button"
        >
          <span>
            <svg
              aria-hidden="true"
              focusable="false"
              className="vads-u-display--block vads-u-margin-right--0 medium-screen:vads-u-margin-right--0p5 icon"
              viewBox="0 2 21 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#fff"
                d="M12 12c-1.1 0-2.04-.4-2.82-1.18A3.85 3.85 0 0 1 8 8c0-1.1.4-2.04 1.18-2.83A3.85 3.85 0 0 1 12 4c1.1 0 2.04.4 2.82 1.17A3.85 3.85 0 0 1 16 8c0 1.1-.4 2.04-1.18 2.82A3.85 3.85 0 0 1 12 12Zm-8 8v-2.8c0-.57.15-1.09.44-1.56a2.9 2.9 0 0 1 1.16-1.09 13.76 13.76 0 0 1 9.65-1.16c1.07.26 2.12.64 3.15 1.16.48.25.87.61 1.16 1.09.3.47.44 1 .44 1.56V20H4Z"
              />
            </svg>
            <div
              data-testid="user-nav-user-name"
              className="user-dropdown-email"
              data-dd-privacy="mask"
              data-dd-action-name="First Name"
            >
              {`${profile.firstName}${isMobile ? '' : ` ${profile.lastName}`}`}
            </div>
          </span>
        </button>
        <div
          className={`va-dropdown-panel ${isDropdownOpen ? '' : 'hidden'}`}
          id={uniqueId.current}
        >
          <ul>
            <li>
              <a data-testid="user-nav-sign-out-link" href={SIGN_OUT_URL}>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return <div className="user-nav">{content}</div>;
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
