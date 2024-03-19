import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import widgetTypes from '../../widgetTypes';

export default async function createNearByVALocations(store) {
  const nearByVALocationsWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VA_LOCATION_NEARBY}"]`,
  );

  if (nearByVALocationsWidget) {
    const { default: NearByVALocations } = await import('./NearByVALocations');
    ReactDOM.render(
      <Provider store={store}>
        <NearByVALocations
          mainPhone={window.mainVBAPhone}
          mainAddress={window.mainVBAAddress}
          mainFacilityApiId={window.mainVBAFacilityApiId}
        />
      </Provider>,
      nearByVALocationsWidget,
    );
  }
}
