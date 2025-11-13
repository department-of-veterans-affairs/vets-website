import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  getRouteInfoFromPath,
  normalizePath,
} from '~/applications/personalization/common/helpers';
import {
  PROFILE_PATHS_WITH_NAMES,
  PROFILE_PATHS,
  PROFILE_BREADCRUMB_BASE,
} from '../constants';
import { routeHasParent } from '../routesForNav';

export const ProfileBreadcrumbs = ({ className, routes }) => {
  const location = useLocation();
  const history = useHistory();

  function handleRouteChange({ detail }) {
    const { href } = detail;
    history.push(href);
  }

  const breadcrumbs = useMemo(
    () => {
      const path = normalizePath(location.pathname);

      if (path === PROFILE_PATHS.PROFILE_ROOT) {
        return PROFILE_BREADCRUMB_BASE;
      }

      try {
        const routeInfo = getRouteInfoFromPath(path, routes);
        const hasParent = routeHasParent(routeInfo, routes);
        if (hasParent) {
          // if the route has a parent, we want to show the parent route in the breadcrumbs
          const parentRouteInfo = routes.find(
            route => route.name === routeInfo.subnavParent,
          );
          return [
            ...PROFILE_BREADCRUMB_BASE,
            {
              href: parentRouteInfo.path,
              label: parentRouteInfo.name,
              isRouterLink: true,
            },
            {
              href: path,
              label: routeInfo.name,
              isRouterLink: true,
            },
          ];
        }

        return [
          ...PROFILE_BREADCRUMB_BASE,
          {
            href: path,
            label: routeInfo.name,
            isRouterLink: true,
          },
        ];
      } catch (e) {
        // if no route matches, then the breadcrumb should reflect the root route
        const rootRouteInfo = PROFILE_PATHS_WITH_NAMES[0];
        return [
          ...PROFILE_BREADCRUMB_BASE,
          {
            href: rootRouteInfo.path,
            label: rootRouteInfo.name,
            isRouterLink: true,
          },
        ];
      }
    },
    [location],
  );

  return (
    <div
      className={className}
      data-breadcrumbs-json={JSON.stringify(breadcrumbs)}
      data-testid="profile-breadcrumbs-wrapper"
    >
      <VaBreadcrumbs
        uswds
        breadcrumbList={breadcrumbs}
        onRouteChange={handleRouteChange}
      />
    </div>
  );
};

ProfileBreadcrumbs.propTypes = {
  className: PropTypes.string,
  routes: PropTypes.array,
};
