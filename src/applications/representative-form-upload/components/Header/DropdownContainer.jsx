// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import Dropdown from './Dropdown';

const DropdownContainer = profile => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="nav__dropdown-group">
      <div
        data-testid="desktop-user-nav"
        className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center"
      >
        <Dropdown
          id="profileMenu"
          dataTestId="user-nav-user-name"
          isOpen={openDropdownId === 'profileMenu'}
          setOpenDropdownId={setOpenDropdownId}
          dropdownClass="nav__profile-menu"
          className="nav__btn nav__btn--user vads-u-color--base arp-profile-dropdown"
          firstName={profile.profile.firstName}
          lastName={profile.profile.lastName}
          icon="account_circle"
          secondaryIcon="chevron_left"
          iconClassName="user-nav__chevron"
          category="mobile"
          size={2}
          view="desktop"
        />
      </div>
      <div className="vads-u-display--flex vads-u-justify-content--center user-nav vads-u-align-items--center mobile">
        <Dropdown
          id="mobileDashboard"
          btnText="Menu"
          icon="menu"
          dropdownClass="nav__full-width"
          isOpen={openDropdownId === 'mobileDashboard'}
          className="nav__btn is--menu"
          closeIcon="close"
          setOpenDropdownId={setOpenDropdownId}
          category="mobileDashboard"
          size={2}
          data-testid="menu-toggle-dropdown-mobile"
          view="mobile"
        />
      </div>
    </div>
  );
};

export default DropdownContainer;
