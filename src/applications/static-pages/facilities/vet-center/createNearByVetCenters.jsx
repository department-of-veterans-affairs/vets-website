import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async function createNearByVetCenters(store) {
  const nearByVetCentersWidget = document.querySelector(
    `[data-widget-type="vet-center-nearby"]`,
  );

  if (nearByVetCentersWidget) {
    const { default: NearByVetCenters } = await import('./nearByVetCenters');
    ReactDOM.render(
      <Provider store={store}>
        <NearByVetCenters
          vetCenters={window.nearbyVetCenters}
          mainVetCenterPhone={window.mainVetCenterPhone}
        />
      </Provider>,
      nearByVetCentersWidget,
    );
  }
}
