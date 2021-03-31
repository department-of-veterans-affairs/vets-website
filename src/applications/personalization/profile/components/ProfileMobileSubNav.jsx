import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { isEscape } from 'platform/utilities/accessibility';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';
import { focusElement } from 'platform/utilities/ui';

import ProfileSubNavItems from './ProfileSubNavItems';

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

  // on first render, set the focus to the h1
  useEffect(() => {
    focusElement('#mobile-subnav-header');
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
      <nav aria-label="secondary" className="menu-wrapper">
        {!isMenuOpen && (
          <button
            ref={openMenuButton}
            className="open-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
          >
            <strong>
              <h1 id="mobile-subnav-header" className={menuButtonClasses}>
                Profile
              </h1>{' '}
              menu
            </strong>
            <i className="fa fa-bars" aria-hidden="true" role="img" />
          </button>
        )}
        {isMenuOpen && (
          <>
            <div className="menu-header vads-u-display--flex">
              <strong className="vads-u-flex--auto">
                <h1 className={menuButtonClasses}>Profile</h1> menu
              </strong>
              <button
                ref={closeMenuButton}
                className="close-menu vads-u-flex--auto"
                type="button"
                onClick={() => {
                  // close menu and set focus to the trigger button
                  setIsMenuOpen(false);
                  setFocusTriggerButton(true);
                }}
              >
                <span>Close</span>
                <i className="fa fa-times" aria-hidden="true" role="img" />
              </button>
            </div>
            <ProfileSubNavItems
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
  isLOA3: PropTypes.bool.isRequired,
  isInMVI: PropTypes.bool.isRequired,
};

export default ProfileMobileSubNav;
