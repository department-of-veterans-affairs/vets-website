import React from 'react';
import UserNavLinks from './UserNavLinks';

const UserDropdown = (dropdownRef, isDropdownOpen, toggleDropdown) => {
  return (
    <div className="va-dropdown" ref={dropdownRef}>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        data-testid="user-nav-dropdown-panel-button"
        className="usa-button nav__user-btn nav__user-btn--user"
        aria-controls="user-nav-links"
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
      </button>
      <div
        className={`va-dropdown-panel ${isDropdownOpen ? '' : 'hidden'}`}
        id="user-nav-links"
      >
        <UserNavLinks />
      </div>
    </div>
  );
};
export default UserDropdown;
