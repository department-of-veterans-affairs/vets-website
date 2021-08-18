// Node modules.
import React from 'react';
// Relative imports.
import startReactApp from '../../startup/react';
import Banner from './components/Banner';
import MaintenanceBanner from './components/MaintenanceBanner';

// Are you looking for where this is used?
// Search for `data-widget-type="banner"` and `data-widget-type="maintenance-banner"` to find all the places this React widget is used.
export default () => {
  // Derive the banner elements to place the App.
  const banners = document.querySelectorAll(`[data-widget-type="banner"]`);
  const maintenanceBanner = document.querySelector(
    `[data-widget-type="maintenance-banner"]`,
  );

  // Create each banner component.
  if (banners) {
    banners?.forEach(banner => {
      startReactApp(<Banner {...banner.dataset} />, banner);
    });
  }

  // Create the maintenance banner component.
  if (maintenanceBanner) {
    startReactApp(
      <MaintenanceBanner {...maintenanceBanner.dataset} />,
      maintenanceBanner,
    );
  }
};
