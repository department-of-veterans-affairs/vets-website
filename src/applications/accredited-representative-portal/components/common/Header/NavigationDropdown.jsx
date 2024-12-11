import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const NavigationDropdown = ({
  btnText,
  icon,
  className,
  name,
  iconClassName,
  secondaryIcon,
  srText,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dropdownRef = useRef(null);
  useEffect(
    () => {
      const handleClickOutside = event => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [isOpen],
  );
  return (
    <div className="va-dropdown" ref={dropdownRef}>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        data-testid="user-nav-dropdown-panel-button"
        className={className}
        aria-controls={icon}
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        type="button"
      >
        {btnText}
        <va-icon
          icon={icon}
          size={2}
          srtext={srText}
          class="nav__user-btn-icon"
        />
        {name}
        {secondaryIcon && (
          <va-icon
            icon={secondaryIcon}
            size={2}
            srtext={srText}
            class={iconClassName}
          />
        )}
      </button>
      {isOpen && (
        <div className="va-dropdown-panel  nav__dropdown" id={icon}>
          <ul className="nav__user-list">{children}</ul>
        </div>
      )}
    </div>
  );
};

NavigationDropdown.propTypes = {
  btnText: PropTypes.string,
  children: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  name: PropTypes.string,
  secondaryIcon: PropTypes.string,
  srText: PropTypes.string,
};

export default NavigationDropdown;
