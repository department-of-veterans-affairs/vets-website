import React from 'react';
import widgetTypes from 'platform/site-wide/widgetTypes';
import startReactApp from '../../startup/react';
import { normalizeSideNavData } from './helpers';

// Are you looking for where this is used?
// Search for `<div data-widget-type="side-nav"></div>` to find all the places
// this React widget is used.
export default async sideNavConfig => {
  // Derive the root element to place the SideNav.
  const root = document.querySelector(
    `[data-widget-type="${widgetTypes.SIDE_NAV}"]`,
  );

  // Escape early if there is no root element found.
  if (!root) {
    return;
  }

  const {
    default: SideNav,
  } = await import(/* webpackChunkName: "side-nav-widget" */ './components/SideNav');

  const { rootPath, data } = sideNavConfig;

  // Normalize the data before we pass it to the SideNav.
  const navItemsLookup = normalizeSideNavData(rootPath, data);

  // Create the SideNav.
  startReactApp(<SideNav navItemsLookup={navItemsLookup} />, root);
};
