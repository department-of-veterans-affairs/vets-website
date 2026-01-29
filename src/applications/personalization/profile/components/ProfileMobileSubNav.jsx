/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEscape } from 'platform/utilities/accessibility';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';
import { focusElement } from 'platform/utilities/ui';
import ProfileSubNav from './ProfileSubNav';

const menuButtonClasses = prefixUtilityClasses([
  'font-size--base',
  'font-family--sans',
  'display--inline',
]).join(' ');

const ProfileMobileSubNav = ({ isLOA3, isInMVI, routes }) => {
  // refs used so we can easily set focus
  const closeMenuButton = useRef(null);
  const openMenuButton = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusTriggerButton, setFocusTriggerButton] = useState(false);

  // on first render, set the focus to the h2
  useEffect(() => {
    focusElement('#mobile-subnav-header-button');
  }, []);

  // When the menu is open trap keyboard focus in the menu itself so keyboard
  // users can't tab their way out of the menu and onto the main page behind the
  // menu. When the menu closes, revert those changes.
  useEffect(
    () => {
      const closeOnEscape = e => {
        if (isEscape(e)) {
          e.preventDefault();
          // close menu and set focus to the trigger button
          setIsMenuOpen(false);
          setFocusTriggerButton(true);
        }
      };
      if (isMenuOpen) {
        document.addEventListener('keydown', closeOnEscape);
        closeMenuButton.current.focus();
      } else {
        document.removeEventListener('keydown', closeOnEscape);
        // Only set the focus on the menu trigger button if the call to the
        // `closeSideNav` action creator passed in the `focusTriggerButton`
        // argument
        if (focusTriggerButton) {
          openMenuButton.current.focus();
          setFocusTriggerButton(false);
        }
      }
    },
    [isMenuOpen, focusTriggerButton],
  );

  return (
    <div className="mobile-nav">
      <nav
        aria-labelledby={
          isMenuOpen ? 'mobile-subnav-header' : 'mobile-subnav-header-button'
        }
        className="menu-wrapper"
      >
        {!isMenuOpen && (
          <h2 tabIndex="-1" className={menuButtonClasses}>
            <button
              ref={openMenuButton}
              className="open-menu"
              type="button"
              onClick={() => setIsMenuOpen(true)}
              id="mobile-subnav-header-button"
            >
              <strong>Profile menu</strong>
              <va-icon icon="menu" size={3} aria-hidden="true" />
            </button>
          </h2>
        )}
        {isMenuOpen && (
          <>
            <div className="menu-header vads-u-display--flex">
              <strong className="vads-u-flex--auto">
                <h2 id="mobile-subnav-header" className={menuButtonClasses}>
                  Profile menu
                </h2>
              </strong>
              <button
                ref={closeMenuButton}
                className="close-menu vads-u-display--flex"
                style={{ alignItems: 'center' }}
                type="button"
                onClick={() => {
                  // close menu and set focus to the trigger button
                  setIsMenuOpen(false);
                  setFocusTriggerButton(true);
                }}
              >
                <span>Close</span>
                <va-icon
                  size={3}
                  icon="close"
                  aria-hidden="true"
                  style={{ top: '1px', position: 'relative' }}
                />
              </button>
            </div>
            <ProfileSubNav
              isLOA3={isLOA3}
              isInMVI={isInMVI}
              routes={routes}
              clickHandler={() => {
                setIsMenuOpen(false);
              }}
            />
          </>
        )}
      </nav>
    </div>
  );
};

ProfileMobileSubNav.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ProfileMobileSubNav;
