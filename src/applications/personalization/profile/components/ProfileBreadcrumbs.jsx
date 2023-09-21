import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  getRouteInfoFromPath,
  normalizePath,
} from '~/applications/personalization/common/helpers';
import { PROFILE_PATHS_WITH_NAMES, PROFILE_PATHS } from '../constants';
import { Toggler } from '~/platform/utilities/feature-toggles';

const BreadcrumbItems = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(
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

      return [
        ...baseBreadCrumbs,
        {
          href: path,
          label: routeInfo.name,
        },
      ];
    },
    [location],
  );

  return breadcrumbs.map(crumb => {
    const Element =
      crumb.href === '/'
        ? {
            Type: 'a',
            linkProp: 'href',
          }
        : {
            Type: Link,
            linkProp: 'to',
          };

    return (
      <li key={crumb.href}>
        <Element.Type {...{ [Element.linkProp]: crumb.href }}>
          {crumb.label}
        </Element.Type>
      </li>
    );
  });
};

export const ProfileBreadcrumbs = ({ className }) => {
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseHubPage}>
      <Toggler.Enabled>
        <div className={className}>
          <VaBreadcrumbs>
            <BreadcrumbItems />
          </VaBreadcrumbs>
        </div>
      </Toggler.Enabled>
    </Toggler>
  );
};

ProfileBreadcrumbs.propTypes = {
  className: PropTypes.string,
};
