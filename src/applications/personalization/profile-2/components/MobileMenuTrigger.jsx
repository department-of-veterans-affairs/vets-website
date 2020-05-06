import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
  closeSideNav as closeSideNavAction,
  openSideNav as openSideNavAction,
  pinMenuTrigger as pinMenuTriggerAction,
  unpinMenuTrigger as unpinMenuTriggerAction,
} from '../actions';

import {
  selectFocusTriggerButton,
  selectIsMenuTriggerPinned,
} from '../selectors';

import { BREAKPOINTS } from '../constants';

const MobileMenuTrigger = ({
  closeSideNav,
  focusTriggerButton,
  openSideNav,
  isMenuTriggerPinned,
  pinMenuTrigger,
  unpinMenuTrigger,
}) => {
  const button = useRef(null);
  const placeholder = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState(null);
  const [triggerHeight, setTriggerHeight] = useState(null);

  // init some local state
  useEffect(() => {
    setTriggerHeight(window.getComputedStyle(button.current).height);
    setTriggerPosition(placeholder.current.offsetTop);
    setIsMobile(window.innerWidth < BREAKPOINTS.medium);
  }, []);

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
      }

      if (justSwitchedToDesktop) {
        setIsMobile(false);
        closeSideNav();
      }
    };

    // pin or unpin the mobile trigger on scroll
    const handleScroll = () => {
      if (!isMobile) return;
      // if the user just scrolled down the page far enough that the menu
      // trigger would go off the top of the page
      if (window.pageYOffset >= triggerPosition && !isMenuTriggerPinned) {
        pinMenuTrigger();
        placeholder.current.style.height = triggerHeight;
      }
      // if the user just scrolled up the page far enough that the menu
      // trigger's position would come back into view
      if (window.pageYOffset < triggerPosition && isMenuTriggerPinned) {
        unpinMenuTrigger();
        placeholder.current.style.height = 0;
      }
    };

    window.addEventListener('resize', handleResize);
    window.onscroll = handleScroll;

    return () => {
      window.removeEventListener('resize', handleResize);
      window.onscroll = null;
    };
  });

  // When the value of focusTriggerButton has changed, we might want to set the
  // focus on the trigger button
  useEffect(
    () => {
      if (focusTriggerButton) {
        button.current.focus();
      }
    },
    [focusTriggerButton],
  );

  const buttonClasses = classnames({ fixed: isMenuTriggerPinned });

  return (
    <div className="va-btn-sidebarnav-trigger">
      {/*
      This invisible placeholder fills the vertical space normally taken up by the `button` when the `button`'s position is fixed and it is pulled out of the normal page flow.
      */}
      <div ref={placeholder} />
      <button
        type="button"
        className={buttonClasses}
        aria-controls="va-profile-sidebar"
        onClick={openSideNav}
        ref={button}
      >
        <span>
          <b>Profile Menu</b>
          <img src="/img/arrow-right-white.svg" alt="" />
        </span>
      </button>
    </div>
  );
};

export { MobileMenuTrigger };

const mapStateToProps = state => ({
  isMenuTriggerPinned: selectIsMenuTriggerPinned(state),
  focusTriggerButton: selectFocusTriggerButton(state),
});

const mapDispatchToProps = {
  closeSideNav: closeSideNavAction,
  openSideNav: openSideNavAction,
  pinMenuTrigger: pinMenuTriggerAction,
  unpinMenuTrigger: unpinMenuTriggerAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileMenuTrigger);
