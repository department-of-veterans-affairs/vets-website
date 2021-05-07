// Dependencies
import React from 'react';
// Relative
import startReactApp from '../../startup/react';
import SideNav from './components/SideNav';
import { normalizeSideNavData } from './helpers';

// Are you looking for where this is used?
// Search for `<div data-widget-type="side-nav"></div>` to find all the places
// this React widget is used.
export default sideNavConfig => {
  // Derive the root element to place the SideNav.
  const root = document.querySelector(`[data-widget-type="side-nav"]`);

  // Escape early if there is no root element found.
  if (!root) {
    return;
  }

  const { rootPath, data } = sideNavConfig;

  // Normalize the data before we pass it to the SideNav.
  const navItemsLookup = normalizeSideNavData(rootPath, data);

  // Create the SideNav.
  startReactApp(<SideNav navItemsLookup={navItemsLookup} />, root);
};
