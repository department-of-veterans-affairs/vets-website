import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import {
  VaSidenav,
  VaSidenavItem,
  VaSidenavSubmenu,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { selectIsBlocked } from '../selectors';

const ProfileSubNav = ({
  isInMVI,
  isLOA3,
  routes,
  clickHandler = null,
  className,
  isSchedulingPreferencesPilotEligible,
}) => {
  const mobileNavRef = useRef();
  const history = useHistory();
  const { pathname } = useLocation();
  const isBlocked = useSelector(selectIsBlocked); // incompetent, fiduciary flag, deceased
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profile2Enabled = useToggleValue(TOGGLE_NAMES.profile2Enabled);

  // Filter out the routes the user cannot access due to
  // not being in MVI/MPI, not having a high enough LOA,
  // or having isBlocked state selector return true
  const filteredRoutes = routes.filter(route => {
    // loa3 check and isBlocked check
    if (route.requiresLOA3 && (!isLOA3 || isBlocked)) {
      return false;
    }
    // scheduling preferences pilot check
    if (
      route.requiresSchedulingPreferencesPilot &&
      !isSchedulingPreferencesPilotEligible
    ) {
      return false;
    }

    // mvi check
    return !(route.requiresMVI && !isInMVI);
  });

  const recordNavUserEvent = e => {
    recordEvent({
      event: 'nav-sidenav',
    });
    if (clickHandler) {
      clickHandler();
    }
    const { href } = e.detail;
    history.push(href);
    if (profile2Enabled && mobileNavRef?.current) {
      const accordionItem = mobileNavRef.current.shadowRoot?.querySelector(
        'va-accordion > va-accordion-item',
      );
      accordionItem?.removeAttribute('open');
    }
  };

  const isActive = path => (pathname === path ? true : undefined);

  // on first render, set the focus to the h2
  useEffect(() => {
    focusElement('#subnav-header');
  }, []);

  if (profile2Enabled) {
    return (
      <VaSidenav
        header="Profile"
        icon-background-color="vads-color-primary"
        icon-name="account_circle"
        ref={mobileNavRef}
        className={className}
      >
        {filteredRoutes.map(route => {
          if (route.subnavParent) {
            return false;
          }
          if (route.hasSubnav) {
            const subnavChildren = filteredRoutes.filter(
              subnavRoute => subnavRoute.subnavParent === route.name,
            );
            return (
              <VaSidenavSubmenu
                currentPage={isActive(route.path)}
                key={route.name}
                label={route.name}
                href={route.path}
                routerLink="true"
                onVaRouteChange={recordNavUserEvent}
              >
                {subnavChildren.map(subnavChild => (
                  <VaSidenavItem
                    currentPage={isActive(subnavChild.path)}
                    key={subnavChild.name}
                    href={subnavChild.path}
                    label={subnavChild.name}
                    routerLink="true"
                    onVaRouteChange={recordNavUserEvent}
                  />
                ))}
              </VaSidenavSubmenu>
            );
          }
          return (
            <VaSidenavItem
              currentPage={isActive(route.path)}
              key={route.name}
              href={route.path}
              label={route.name}
              routerLink="true"
              onVaRouteChange={recordNavUserEvent}
            />
          );
        })}
      </VaSidenav>
    );
  }

  // This will be replaced with the return above once Paperless delivery is live
  return (
    <ul className="vads-u-margin-top--0">
      {filteredRoutes.map(route => (
        <li key={route.path}>
          <NavLink
            activeClassName="is-active"
            exact
            to={route.path}
            onClick={recordNavUserEvent}
          >
            {route.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

ProfileSubNav.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  // Optional handler to fire when a nav item is clicked
  className: PropTypes.string,
  clickHandler: PropTypes.func,
  isSchedulingPreferencesPilotEligible: PropTypes.bool,
};

export default ProfileSubNav;
