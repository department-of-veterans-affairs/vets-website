// Node modules.
import React from 'react';
import { connect } from 'react-redux';
// Relative imports.
import { hideDefaultBanner } from '../../helpers';

export const App = () => {
  // Hide the default location banner image.
  hideDefaultBanner();

  // Render the shifted location banner image.
  return (
    <div id="vets-banner-2" className="veteran-banner">
      <div className="veteran-banner-container vads-u-margin-y--0 vads-u-margin-x--auto">
        <picture>
          <source
            srcSet="/img/homepage/veterans-banner-mobile-1.png 640w, /img/homepage/veterans-banner-mobile-2.png 920w, /img/homepage/veterans-banner-mobile-3.png 1316w"
            media="(max-width: 767px)"
          />
          <source
            srcSet="/img/homepage/veterans-banner-tablet-1.png 1008w, /img/homepage/veterans-banner-tablet-2.png 1887w"
            media="(max-width: 1008px)"
          />
          <img
            className="veteran-banner-image"
            src="/img/homepage/veterans-banner-desktop-1.png"
            srcSet="/img/homepage/veterans-banner-desktop-1.png 1280w, /img/homepage/veterans-banner-desktop-2.png 2494w"
            alt="Veteran portraits"
          />
        </picture>
      </div>
    </div>
  );
};

export default connect()(App);
