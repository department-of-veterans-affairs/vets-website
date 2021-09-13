import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import widgetTypes from '../../widgetTypes';

export default async function createNearByVetCenters(store) {
  const nearByVetCentersWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_NEARBY}"]`,
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
