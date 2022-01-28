// Node modules.
import React from 'react';
// Relative imports.
import App from './components/App';
import startReactApp from '../../startup/react';
import { formatPromoBannerType } from './helpers';

// Are you looking for where this is used?
// Search for `data-widget-type="promo-banner"` to find all the places this React widget is used.
export default () => {
  // Derive the promoBanner elements to place the App.
  const promoBanners = document.querySelectorAll(
    `[data-widget-type="promo-banner"]`,
  );

  // Create each banner component.
  if (promoBanners) {
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
