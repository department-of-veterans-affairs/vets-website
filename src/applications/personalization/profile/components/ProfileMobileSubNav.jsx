import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  getTabbableElements,
  isEscape,
  isReverseTab,
  isTab,
} from 'platform/utilities/accessibility';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';
import { focusElement } from 'platform/utilities/ui';

import ProfileSubNavItems from './ProfileSubNavItems';

import { BREAKPOINTS } from '../constants';

// Helper that gets the full height of an HTMLElement including margins
const getElementHeight = el => {
  const style = window.getComputedStyle(el);
  const { height, marginTop, marginBottom } = style;
  return (
    [height, marginTop, marginBottom]
      // strip 'px' or other units from the three measurements
      .map(parseFloat)
      // and add them all together
      .reduce((dimension, sum) => sum + dimension, 0)
  );
};

const menuButtonClasses = prefixUtilityClasses([
  'font-size--base',
  'font-family--sans',
  'display--inline',
]).join(' ');

const ProfileMobileSubNav = ({ isLOA3, isInMVI, routes }) => {
  // ref used so we can easily get the element's height
  const theMenu = useRef(null);
  // ref used so we can easily set its height
  const placeholder = useRef(null);
  // refs used so we can easily set focus
  const closeMenuButton = useRef(null);
  const openMenuButton = useRef(null);
  const lastMenuItem = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState(null);
  const [isMenuPinned, setIsMenuPinned] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusTriggerButton, setFocusTriggerButton] = useState(false);

  const overrideShiftTab = e => {
    if (isReverseTab(e)) {
      e.preventDefault();
      lastMenuItem.current.focus();
    }
  };

  const overrideTab = e => {
    if (isTab(e)) {
      e.preventDefault();
      closeMenuButton.current.focus();
    }
  };

  // init some local state
  useEffect(() => {
    const menuButtonHeight = getElementHeight(theMenu.current);
    placeholder.current.style.height = `${menuButtonHeight}px`;
    setTriggerPosition(placeholder.current.offsetTop);
    setIsMobile(window.innerWidth < BREAKPOINTS.medium);
  }, []);

  // on first render, set the focus to the h1
  useEffect(() => {
    focusElement('#mobile-subnav-header');
  }, []);

  // pin/unpin the mobile menu on scroll and resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < BREAKPOINTS.medium;
      const justSwitchedToMobile = mobile && !isMobile;
      const justSwitchedToDesktop = isMobile && !mobile;

      // The position of the trigger might move up or down as the window width
      // changes and elements above it compress and take up more vertical space
      // so we need to reset it on window resize
      if (mobile) {
        setTriggerPosition(placeholder.current.offsetTop);
      }

      if (justSwitchedToMobile) {
        setIsMobile(true);
        const menuButtonHeight = getElementHeight(theMenu.current);
        placeholder.current.style.height = `${menuButtonHeight}px`;
      }

      if (justSwitchedToDesktop) {
        setIsMobile(false);
        setIsMenuOpen(false);
      }
    };

    // pin or unpin the mobile trigger on scroll
    const handleScroll = () => {
      if (!isMobile) return;
      // if the user just scrolled down the page far enough that the menu
      // trigger would go off the top of the page
      if (window.pageYOffset >= triggerPosition && !isMenuPinned) {
        setIsMenuPinned(true);
      }
      // if the user just scrolled up the page far enough that the menu
      // trigger's position would come back into view
      if (window.pageYOffset < triggerPosition && isMenuPinned) {
        setIsMenuPinned(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.onscroll = handleScroll;

    return () => {
      window.removeEventListener('resize', handleResize);
      window.onscroll = null;
    };
  });

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
        // trap the focus so that you can't tab the focus to an element behind the
        // open mobile subnav
        closeMenuButton.current.addEventListener('keydown', overrideShiftTab);
        lastMenuItem.current = Array.from(
          getTabbableElements(document.querySelector('.menu-wrapper ul')),
        ).pop();
        lastMenuItem.current.addEventListener('keydown', overrideTab);
      } else {
        document.removeEventListener('keydown', closeOnEscape);
        // Only set the focus on the menu trigger button if the call to the
        // `closeSideNav` action creator passed in the `focusTriggerButton`
        // argument
        if (focusTriggerButton) {
          openMenuButton.current.focus();
          setFocusTriggerButton(false);
        }
        if (closeMenuButton.current) {
          closeMenuButton.current.removeEventListener(
            'keydown',
            overrideShiftTab,
          );
        }
        if (lastMenuItem.current) {
          lastMenuItem.current.removeEventListener('keydown', overrideTab);
        }
      }
    },
    [isMenuOpen, focusTriggerButton],
  );

  const menuClasses = classnames('the-menu', {
    fixed: isMenuPinned,
  });

  return (
    <div className="mobile-nav">
      <div className={menuClasses}>
        <div className="menu-background" />
        <nav aria-label="secondary" className="menu-wrapper" ref={theMenu}>
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
      {/*
      This invisible placeholder fills the vertical space that would normally be taken up by the `div.the-menu` or its child `div.menu-wrapper` above. The fact that the `div.menu-wrapper` is positioned absolutely means that it does not take up any space in the normal document flow so we need to use this placeholder instead.
      */}
      <div ref={placeholder} />
    </div>
  );
};

ProfileMobileSubNav.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
  isInMVI: PropTypes.bool.isRequired,
};

export default ProfileMobileSubNav;
