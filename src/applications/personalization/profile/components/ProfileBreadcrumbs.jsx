import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  getRouteInfoFromPath,
  normalizePath,
} from '~/applications/personalization/common/helpers';

import { PROFILE_PATHS_WITH_NAMES, PROFILE_PATHS } from '../constants';

const BreadcrumbContent = () => {
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(
    () => {
      const baseBreadCrumbs = [
        { href: '/', label: 'Home' },
        { href: '/profile', label: 'Profile' },
      ];

      const path = normalizePath(location.pathname);

      if (path === PROFILE_PATHS.PROFILE_ROOT) {
        return baseBreadCrumbs;
      }

      const routeInfo = getRouteInfoFromPath(path, PROFILE_PATHS_WITH_NAMES);

      setBreadcrumbs([
        ...baseBreadCrumbs,
        {
          href: path,
          label: routeInfo.name,
        },
      ]);
      return null;
    },
    [location, setBreadcrumbs],
  );

  if (breadcrumbs.length === 0) {
    return null;
  }

  return breadcrumbs.map(crumb => (
    <li key={crumb.href}>
      <Link to={crumb.href}>{crumb.label}</Link>
    </li>
  ));
};

export const ProfileBreadcrumbs = () => {
  return (
    <div className="vads-u-padding-left--3">
      <VaBreadcrumbs>
        <BreadcrumbContent />
      </VaBreadcrumbs>
    </div>
  );
};
