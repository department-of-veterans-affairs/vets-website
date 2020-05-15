import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
} from 'platform/utilities/accessibility';

import { childRoutes } from '../routes';

import { closeSideNav as closeSideNavAction } from '../actions';
import { selectIsSideNavOpen } from '../selectors';

const ProfileSideNav = ({ closeSideNav, isSideNavOpen }) => {
  const closeButton = useRef(null);
  const lastMenuItem = useRef(null);

  const overrideShiftTab = e => {
    if (isReverseTab(e)) {
      e.preventDefault();
      lastMenuItem.current.focus();
    }
  };

  const overrideTab = e => {
    if (isTab(e)) {
      e.preventDefault();
      closeButton.current.focus();
    }
  };

  useEffect(
    () => {
      // I can't set the ref directly on the last menu item in the render logic
      // since passing refs through react-router-3 Link elements does not seem
      // to work :(
      lastMenuItem.current = Array.from(
        getTabbableElements(document.getElementById('va-profile-sidebar')),
      ).pop();
      const closeOnEscape = e => {
        if (isEscape(e)) {
          e.preventDefault();
          closeSideNav(true);
        }
      };
      if (isSideNavOpen) {
        closeButton.current.focus();
        document.body.style.overflow = 'hidden';
        // trap the focus so that you can't tab the focus to an element behind the
        // open mobile sidenav
        closeButton.current.addEventListener('keydown', overrideShiftTab);
        lastMenuItem.current.addEventListener('keydown', overrideTab);
        document.addEventListener('keydown', closeOnEscape);
      } else {
        document.body.style.overflow = 'initial';
        closeButton.current.removeEventListener('keydown', overrideShiftTab);
        lastMenuItem.current.removeEventListener('keydown', overrideTab);
        document.removeEventListener('keydown', closeOnEscape);
      }
    },
    [closeButton, closeSideNav, isSideNavOpen],
  );

  const sideNavClasses = classnames('va-sidebarnav', {
    'va-sidebarnav--opened': isSideNavOpen,
  });

  return (
    <nav
      className={sideNavClasses}
      id="va-profile-sidebar"
      aria-label="Secondary"
    >
      <div>
        <button
          type="button"
          aria-label="Close this menu"
          className="va-btn-close-icon va-sidebarnav-close"
          ref={closeButton}
          onClick={() => {
            closeSideNav(true);
          }}
        />
        <h2 className="vads-u-font-size--h4">Profile</h2>
        <ul>
          {Object.values(childRoutes).map((route, i) => (
            <li key={i}>
              <Link
                activeClassName="is-active"
                to={route.path}
                onClick={() => {
                  closeSideNav(false);
                }}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  isSideNavOpen: selectIsSideNavOpen(state),
});

const mapDispatchToProps = {
  closeSideNav: closeSideNavAction,
};

export { ProfileSideNav };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSideNav);
