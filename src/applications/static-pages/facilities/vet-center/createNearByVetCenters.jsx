import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';

export default async function createNearByVetCenters(store) {
  const nearByVetCentersWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_NEARBY}"]`,
  );

  if (nearByVetCentersWidget) {
    const { default: NearByVetCenters } = await import('./NearByVetCenters');
    ReactDOM.render(
      <Provider store={store}>
        <NearByVetCenters
          vetCenters={window.nearbyVetCenters}
          mainVetCenterPhone={window.mainVetCenterPhone}
          mainVetCenterAddress={window.mainVetCenterAddress}
          mainVetCenterId={window.mainVetCenterId}
          satteliteVetCenters={window.satteliteVetCenters}
        />
      </Provider>,
      nearByVetCentersWidget,
    );
  }
}
