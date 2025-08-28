import React, { forwardRef, useEffect } from 'react';
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

const ProfileSubNav = forwardRef(
  ({ isInMVI, isLOA3, routes, clickHandler = null }, ref) => {
    const history = useHistory();
    const { pathname } = useLocation();
    const isBlocked = useSelector(selectIsBlocked); // incompetent, fiduciary flag, deceased
    const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
    const showPaperlessDelivery = useToggleValue(
      TOGGLE_NAMES.profileShowPaperlessDelivery,
    );

    // Filter out the routes the user cannot access due to
    // not being in MVI/MPI, not having a high enough LOA,
    // or having isBlocked state selector return true
    const filteredRoutes = routes.filter(route => {
      // loa3 check and isBlocked check
      if (route.requiresLOA3 && (!isLOA3 || isBlocked)) {
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
      if (showPaperlessDelivery && ref?.current) {
        const button = ref.current.shadowRoot
          ?.querySelector('va-accordion > va-accordion-item')
          ?.shadowRoot?.querySelector('button');

        button.click();
      }
    };

    const isActive = path => (pathname === path ? true : undefined);

    // on first render, set the focus to the h2
    useEffect(() => {
      focusElement('#subnav-header');
    }, []);

    if (showPaperlessDelivery) {
      return (
        <VaSidenav
          header="Profile"
          icon-background-color="vads-color-primary"
          icon-name="account_circle"
          role="navigation"
          ref={ref}
        >
          {filteredRoutes.map(route => {
            // Checks if route should be rendered inside a submenu by looking for a subnavParent
            // If route has a subnavParent, checks for all other routes with the same subnavParent
            // If there are 2 or more routes with the same subnavParent, render them inside a submenu
            // If route is not the first child of a subnavParent, skip because it's rendered elsewhere
            // If there is only 1 route for a subnavParent, render as individual route
            if (route.subnavParent) {
              const subnavChildren = filteredRoutes.filter(
                subnavRoute => subnavRoute.subnavParent === route.subnavParent,
              );
              const hasSubnavChildren = subnavChildren.length > 1;
              const isFirstChild = subnavChildren[0]?.name === route.name;
              if (!isFirstChild) return null;
              if (hasSubnavChildren) {
                return (
                  <VaSidenavSubmenu
                    key={route.subnavParent}
                    label={route.subnavParent}
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
  },
);

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
  clickHandler: PropTypes.func,
};

export default ProfileSubNav;
