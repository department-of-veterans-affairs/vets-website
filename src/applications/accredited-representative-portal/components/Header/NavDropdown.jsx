import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// https://stackoverflow.com/a/54292872/1055505
function useMouseDownOutside(callback) {
  const elementRef = useRef();
  const callbackRef = useRef();

  // set current callback in ref, before second useEffect uses it
  useEffect(() => {
    // useEffect wrapper to be safe for concurrent mode
    callbackRef.current = callback;
  });

  useEffect(() => {
    // read most recent callback and elementRef dom node from refs
    function handleMouseDown(event) {
      if (!elementRef.current || !callbackRef.current) return;
      if (elementRef.current.contains(event.target)) return;

      callbackRef.current(event);
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []); // no need for callback + elementRef dep

  return elementRef; // return ref; client can omit `useRef`
}

const NavDropdown = ({
  btnText,
  icon,
  className,
  name,
  iconClassName,
  secondaryIcon,
  srText,
  children,
  dataTestId,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const dropdownRef = useMouseDownOutside(() => setIsDropdownOpen(false));

  return (
    <div className="va-dropdown" ref={dropdownRef}>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        data-testid={`${icon}-toggle-dropdown`}
        className={className}
        aria-controls={icon}
        aria-expanded={isDropdownOpen}
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
        <span data-testid={dataTestId}>{name}</span>
        {secondaryIcon && (
          <va-icon
            icon={secondaryIcon}
            size={2}
            srtext={srText}
            class={iconClassName}
          />
        )}
      </button>
      {isDropdownOpen && (
        <div className="va-dropdown-panel  nav__dropdown" id={icon}>
          <ul className="nav__user-list">{children}</ul>
        </div>
      )}
    </div>
  );
};

NavDropdown.propTypes = {
  btnText: PropTypes.string,
  children: PropTypes.object,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  name: PropTypes.string,
  secondaryIcon: PropTypes.string,
  srText: PropTypes.string,
};

export default NavDropdown;
