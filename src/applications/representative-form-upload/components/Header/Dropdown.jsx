import React from 'react';
import PropTypes from 'prop-types';
import DropdownLinks from './DropdownLinks';

const Dropdown = ({
  id,
  isOpen,
  setOpenDropdownId,
  category,
  btnText,
  icon,
  className,
  firstName,
  lastName,
  iconClassName,
  secondaryIcon,
  srText,
  dropdownClass,
  closeIcon,
  view,
  size,
}) => {
  const toggleDropdown = () => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const closeDropdown = () => setOpenDropdownId(null);

  return (
    <div className={`va-dropdown ${dropdownClass}`}>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        data-testid={`${icon}-toggle-dropdown-${view}`}
        className={closeIcon && isOpen ? 'is--open nav__btn' : className}
        aria-controls={icon}
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        type="button"
      >
        {closeIcon && isOpen ? 'Close' : btnText}
        <va-icon
          icon={closeIcon && isOpen ? 'close' : icon}
          size={size}
          srtext={srText}
          class="nav__user-btn-icon"
        />
        {firstName && (
          <p className="nav__btn--user-name">
            <span>{firstName}</span> <span className="desktop">{lastName}</span>
          </p>
        )}

        {secondaryIcon && (
          <va-icon icon={secondaryIcon} size={size} class={iconClassName} />
        )}
      </button>
      {isOpen && (
        <div>
          <div
            className="va-dropdown-panel  nav__dropdown"
            id={icon}
            data-testid={`${icon}-toggle-dropdown-${view}-list`}
          >
            <ul className="nav__user-list">
              <DropdownLinks
                closeDropdown={closeDropdown}
                category={category}
              />
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

Dropdown.propTypes = {
  btnText: PropTypes.string,
  children: PropTypes.object,
  className: PropTypes.string,
  closeIcon: PropTypes.string,
  dataTestId: PropTypes.string,
  dropdownClass: PropTypes.string,
  firstName: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  lastName: PropTypes.string,
  secondaryIcon: PropTypes.string,
  srText: PropTypes.string,
  view: PropTypes.string,
  size: PropTypes.number,
};
