// Node modules.
import React from 'react';
// Relative imports.
import startReactApp from '../../startup/react';
import Banner from './components/Banner';
import MaintenanceBanner from './components/MaintenanceBanner';
import widgetTypes from '~/applications/static-pages/widgetTypes';

// Are you looking for where this is used?
// Search for `data-widget-type="banner"` and `data-widget-type="maintenance-banner"` to find all the places this React widget is used.
export default () => {
  // Derive the banner elements to place the App.
  const banners = document.querySelectorAll(
    `[data-widget-type="${widgetTypes.BANNER}"]`,
  );
  const maintenanceBanner = document.querySelector(
    `[data-widget-type="${widgetTypes.MAINTENANCE_BANNER}"]`,
  );

  // Create each banner component.
  if (banners) {
    for (let index = 0; index < banners.length; index++) {
      const banner = banners[index];
      startReactApp(<Banner {...banner.dataset} />, banner);
    }
  }

  // Create the maintenance banner component.
  if (maintenanceBanner) {
    startReactApp(
      <MaintenanceBanner {...maintenanceBanner.dataset} />,
      maintenanceBanner,
    );
  }
};
