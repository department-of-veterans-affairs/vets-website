import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  VaSidenav,
  VaSidenavItem,
  VaSidenavSubmenu,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import recordEvent from 'platform/monitoring/record-event';
import { selectIsBlocked } from '../selectors';
import { PROFILE_PATH_NAMES } from '../constants';

function ProfileSubNavItems({ routes, isLOA3, isInMVI, clickHandler = null }) {
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

  let notificationSettingsIndex;
  let paperlessDeliveryIndex;
  let beforeRoutes;
  let nestedRoutes;
  let afterRoutes;
  if (showPaperlessDelivery) {
    notificationSettingsIndex = filteredRoutes.findIndex(
      r => r.name === PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS,
    );
    paperlessDeliveryIndex = filteredRoutes.findIndex(
      r => r.name === PROFILE_PATH_NAMES.PAPERLESS_DELIVERY,
    );
    beforeRoutes = filteredRoutes.slice(0, notificationSettingsIndex);
    nestedRoutes = filteredRoutes.slice(
      notificationSettingsIndex,
      paperlessDeliveryIndex + 1,
    );
    afterRoutes = filteredRoutes.slice(paperlessDeliveryIndex + 1);
  }

  const recordNavUserEvent = e => {
    recordEvent({
      event: 'nav-sidenav',
    });
    if (clickHandler) {
      clickHandler();
    }
    const { href } = e.detail;
    history.push(href);
  };

  const isActive = path => (pathname === path ? true : undefined);
  const hasSubmenu = !!nestedRoutes?.length;

  if (showPaperlessDelivery) {
    return (
      <VaSidenav
        header="Profile"
        icon-background-color="vads-color-primary"
        icon-name="account_circle"
      >
        {beforeRoutes.map(route => (
          <VaSidenavItem
            currentPage={isActive(route.path)}
            key={route.name}
            href={route.path}
            label={route.name}
            routerLink="true"
            onVaRouteChange={recordNavUserEvent}
          />
        ))}
        {hasSubmenu && (
          <VaSidenavSubmenu
            key="Communication settings"
            label="Communication settings"
          >
            {nestedRoutes.map(route => (
              <VaSidenavItem
                currentPage={isActive(route.path)}
                key={route.name}
                href={route.path}
                label={route.name}
                routerLink="true"
                onVaRouteChange={recordNavUserEvent}
              />
            ))}
          </VaSidenavSubmenu>
        )}
        {afterRoutes.map(route => (
          <VaSidenavItem
            currentPage={isActive(route.path)}
            key={route.name}
            href={route.path}
            label={route.name}
            routerLink="true"
            onVaRouteChange={recordNavUserEvent}
          />
        ))}
      </VaSidenav>
    );
  }

  return (
    <VaSidenav
      header="Profile"
      icon-background-color="vads-color-primary"
      icon-name="account_circle"
    >
      {filteredRoutes.map(route => (
        <VaSidenavItem
          currentPage={isActive(route.path)}
          key={route.name}
          href={route.path}
          label={route.name}
          routerLink="true"
          onVaRouteChange={recordNavUserEvent}
        />
      ))}
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
  // Optional handler to fire when a nav item is clicked
  clickHandler: PropTypes.func,
};

export default ProfileSubNavItems;
