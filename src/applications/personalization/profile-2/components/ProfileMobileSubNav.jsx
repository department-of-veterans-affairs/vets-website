import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
  getTabbableElements,
  isEscape,
  isReverseTab,
  isTab,
} from 'platform/utilities/accessibility';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';
import { focusElement } from 'platform/utilities/ui';

import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';

import { ProfileMenuItems } from './ProfileSubNav';

import {
  closeSideNav as closeSideNavAction,
  openSideNav as openSideNavAction,
  pinMenuTrigger as pinMenuTriggerAction,
  unpinMenuTrigger as unpinMenuTriggerAction,
} from '../actions';

import {
  selectFocusTriggerButton,
  selectIsSideNavOpen,
  selectIsMenuTriggerPinned,
} from '../selectors';

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

const ProfileMobileSubNav = ({
  openMenu,
  closeMenu,
  isTriggerButtonFocused,
  isLOA3,
  isMenuPinned,
  isMenuOpen,
  pinMenu,
  unpinMenu,
  routes,
}) => {
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
        closeMenu();
      }
    };

    // pin or unpin the mobile trigger on scroll
    const handleScroll = () => {
      if (!isMobile) return;
      // if the user just scrolled down the page far enough that the menu
      // trigger would go off the top of the page
      if (window.pageYOffset >= triggerPosition && !isMenuPinned) {
        pinMenu();
      }
      // if the user just scrolled up the page far enough that the menu
      // trigger's position would come back into view
      if (window.pageYOffset < triggerPosition && isMenuPinned) {
        unpinMenu();
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
          closeMenu(true);
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
        if (isTriggerButtonFocused) {
          openMenuButton.current.focus();
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
    [closeMenu, isMenuOpen, isTriggerButtonFocused],
  );

  const menuClasses = classnames('the-menu', {
    fixed: isMenuPinned,
  });

  return (
    <div className="mobile-nav">
      <div className={menuClasses}>
        <div className="menu-wrapper" ref={theMenu}>
          {!isMenuOpen && (
            <button
              ref={openMenuButton}
              className="open-menu"
              type="button"
              onClick={openMenu}
            >
              <strong>
                <h1 id="mobile-subnav-header" className={menuButtonClasses}>
                  Your profile
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
                  <h1 className={menuButtonClasses}>Your profile</h1> menu
                </strong>
                <button
                  ref={closeMenuButton}
                  className="close-menu vads-u-flex--auto"
                  type="button"
                  onClick={() => {
                    // close menu and set focus to the trigger button
                    closeMenu(true);
                  }}
                >
                  <span>Close</span>
                  <i className="fa fa-times" aria-hidden="true" role="img" />
                </button>
              </div>
              <ProfileMenuItems
                isLOA3={isLOA3}
                routes={routes}
                clickHandler={() => {
                  closeMenu();
                }}
              />
            </>
          )}
        </div>
      </div>
      {/*
      This invisible placeholder fills the vertical space that would normally be taken up by the `div.the-menu` or its child `div.menu-wrapper` above. The fact that the `div.menu-wrapper` is positioned absolutely means that it does not take up any space in the normal document flow so we need to use this placeholder instead.
      */}
      <div ref={placeholder} />
    </div>
  );
};

export { ProfileMobileSubNav };

ProfileMobileSubNav.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  isTriggerButtonFocused: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  isMenuPinned: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  pinMenu: PropTypes.func.isRequired,
  unpinMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isTriggerButtonFocused: selectFocusTriggerButton(state),
  isLOA3: isLOA3Selector(state),
  isMenuPinned: selectIsMenuTriggerPinned(state),
  isMenuOpen: selectIsSideNavOpen(state),
});

const mapDispatchToProps = {
  closeMenu: closeSideNavAction,
  openMenu: openSideNavAction,
  pinMenu: pinMenuTriggerAction,
  unpinMenu: unpinMenuTriggerAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileMobileSubNav);
