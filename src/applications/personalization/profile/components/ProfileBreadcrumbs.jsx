import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
import { Toggler } from '~/platform/utilities/feature-toggles';

const BreadcrumbItems = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(
    () => {
      const path = normalizePath(location.pathname);

      if (path === PROFILE_PATHS.PROFILE_ROOT) {
        return PROFILE_BREADCRUMB_BASE;
      }

      const routeInfo = getRouteInfoFromPath(path, PROFILE_PATHS_WITH_NAMES);

      return [
        ...PROFILE_BREADCRUMB_BASE,
        {
          href: path,
          label: routeInfo.name,
        },
      ];
    },
    [location],
  );

  return breadcrumbs.map(crumb => {
    // only the home breadcrumb should be an anchor tag
    // the rest should be react-router-dom Links
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
