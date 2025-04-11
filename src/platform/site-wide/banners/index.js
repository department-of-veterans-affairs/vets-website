import React from 'react';
import widgetTypes from 'platform/site-wide/widgetTypes';
import startReactApp from '../../startup/react';

// Are you looking for where this is used?
// Search for `data-widget-type="banner"` and `data-widget-type="maintenance-banner"` to find all the places this React widget is used.
export default async () => {
  // Derive the banner elements to place the App.
  const maintenanceBanner = document.querySelector(
    `[data-widget-type="${widgetTypes.MAINTENANCE_BANNER}"]`,
  );

  // Create the maintenance banner component.
  if (maintenanceBanner) {
    const { default: MaintenanceBanner } = await import(
      /* webpackChunkName: "maintenance-banner-widget" */ './components/MaintenanceBanner'
    );

    startReactApp(
      <MaintenanceBanner {...maintenanceBanner.dataset} />,
      maintenanceBanner,
    );
  }
};
