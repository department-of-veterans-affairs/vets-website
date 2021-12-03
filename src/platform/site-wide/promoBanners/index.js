// Node modules.
import React from 'react';
import PromoBanner from '@department-of-veterans-affairs/component-library/PromoBanner';
// Relative imports.
import startReactApp from '../../startup/react';

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
        <PromoBanner
          href={promoBanner?.dataset?.link}
          text={promoBanner?.dataset?.title}
          type={promoBanner?.dataset?.type}
        />,
        promoBanner,
      );
    }
  }
};
