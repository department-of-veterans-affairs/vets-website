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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="444.819"
            height="444.819"
            viewBox="0 0 444.819 444.819"
          >
            <path
              fill="#ffffff"
              d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export { MobileMenuTrigger };

const mapStateToProps = state => ({
  isMenuTriggerPinned: state.profileUi?.isMenuTriggerPinned,
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
