import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
  closeSideNav as closeSideNavAction,
  openSideNav as openSideNavAction,
  pinMenuTrigger as pinMenuTriggerAction,
  unpinMenuTrigger as unpinMenuTriggerAction,
} from '../actions';

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

  const [mobileBreakpoint] = useState(767);
  const [isMobile, setIsMobile] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState(null);
  const [triggerHeight, setTriggerHeight] = useState(null);

  // init some local state
  useEffect(
    () => {
      setTriggerHeight(window.getComputedStyle(button.current).height);
      setTriggerPosition(placeholder.current.offsetTop);
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    },
    [mobileBreakpoint],
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= mobileBreakpoint;
      if (!mobile) {
        if (isMobile) {
          setIsMobile(false);
          closeSideNav();
        }
        return;
      }
      // The position of the trigger might move up or down as the window width
      // changes and elements above it compress and take up more vertical space
      // so we need to reset it on window resize
      setTriggerPosition(placeholder.current.offsetTop);
      if (!isMobile) {
        setIsMobile(true);
      }
    };
    // pin or unpin the mobile trigger
    const handleScroll = () => {
      if (!isMobile) return;
      if (window.pageYOffset >= triggerPosition && !isMenuTriggerPinned) {
        pinMenuTrigger();
        placeholder.current.style.height = triggerHeight;
      }
      if (window.pageYOffset < triggerPosition && isMenuTriggerPinned) {
        unpinMenuTrigger();
        placeholder.current.style.height = 0;
      }
    };

    window.addEventListener('resize', handleResize);
    window.onscroll = handleScroll;

    if (focusTriggerButton) {
      button.current.focus();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.onscroll = null;
    };
  });

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
        aria-controls="va-detailpage-sidebar"
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
  isMenuTriggerPinned: state.profileUi?.isMenuTriggerPinned,
  focusTriggerButton: state.profileUi?.focusTriggerButton,
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
