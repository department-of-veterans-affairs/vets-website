// Node modules.
import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
// Relative imports.
import startReactApp from '../../startup/react';
import widgetTypes from '~/applications/static-pages/widgetTypes';
import { deriveStorage } from './helpers';

// Are you looking for where this is used?
// Search for `data-widget-type="banner"` and `data-widget-type="maintenance-banner"` to find all the places this React widget is used.
export default async () => {
  // Derive the banner elements to place the App.
  const banners = document.querySelectorAll(
    `[data-widget-type="${widgetTypes.BANNER}"]`,
  );
  const maintenanceBanner = document.querySelector(
    `[data-widget-type="${widgetTypes.MAINTENANCE_BANNER}"]`,
  );

  // Create each banner component.
  if (banners) {
    const {
      default: Banner,
    } = await import(/* webpackChunkName: "banner-widget" */ '@department-of-veterans-affairs/component-library/Banner');

    for (let index = 0; index < banners.length; index++) {
      const banner = banners[index];

      // Render the banner.
      startReactApp(
        <Banner
          content={banner.dataset.content}
          recordEvent={recordEvent}
          showClose={banner?.dataset?.dismissibleStatus !== 'perm'}
          storage={deriveStorage(banner)}
          title={banner.dataset.title}
          type={banner.dataset.type}
          visible={banner.dataset.visible}
        />,
        banner,
      );
    }
  }

  // Create the maintenance banner component.
  if (maintenanceBanner) {
    const {
      default: MaintenanceBanner,
    } = await import(/* webpackChunkName: "maintenance-banner-widget" */ './components/MaintenanceBanner');

    startReactApp(
      <MaintenanceBanner {...maintenanceBanner.dataset} />,
      maintenanceBanner,
    );
  }
};
