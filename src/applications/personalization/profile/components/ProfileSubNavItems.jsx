import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaSidenav,
  VaSidenavItem,
  VaSidenavSubmenu,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { selectIsBlocked } from '../selectors';

function ProfileSubNavItems({ routes, isLOA3, isInMVI }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const isBlocked = useSelector(selectIsBlocked); // incompetent, fiduciary flag, deceased

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
    const { href } = e.detail;
    history.push(href);
  };

  const isActive = path => (pathname === path ? true : undefined);

  return (
    <VaSidenav
      header="Profile"
      icon-background-color="vads-color-primary"
      icon-name="account_circle"
      role="navigation"
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
          if (!hasSubnavChildren) {
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
          }
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

ProfileSubNavItems.propTypes = {
  isInMVI: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ProfileSubNavItems;
