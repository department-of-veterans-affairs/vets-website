// Node modules.
import React from 'react';
// Relative imports.
import startReactApp from '../../startup/react';
import { formatPromoBannerType } from './helpers';

// Are you looking for where this is used?
// Search for `data-widget-type="promo-banner"` to find all the places this React widget is used.
export default async () => {
  // Derive the promoBanner elements to place the App.
  const promoBanners = document.querySelectorAll(
    `[data-widget-type="promo-banner"]`,
  );

  // Create each banner component.
  if (promoBanners) {
    const {
      default: App,
    } = await import(/* webpackChunkName: "promo-banner-widget" */ './components/App');
    for (let index = 0; index < promoBanners.length; index++) {
      const promoBanner = promoBanners[index];

      // Render the promoBanner.
      startReactApp(
        <App
          href={promoBanner?.dataset?.link}
          id={promoBanner?.dataset?.id}
          text={promoBanner?.dataset?.title}
          type={formatPromoBannerType(promoBanner?.dataset?.type)}
        />,
        promoBanner,
      );
    }
  }
};
