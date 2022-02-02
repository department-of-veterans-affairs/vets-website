import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import widgetTypes from '../widgetTypes';
import { standardizeDateTime } from './facilityUtilities';
import VetCenterHours from './vetCentersHours';

export default async function createVetCentersHours(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_HOURS}"]`,
  );

  if (vetCentersHoursWidget) {
    const vetCenterHoursArray = standardizeDateTime(window.vetCenterHours);
    const isSatelliteLocation = window.isSatelliteLocation;
    ReactDOM.render(
      <Provider store={store}>
        <VetCenterHours
          hours={vetCenterHoursArray}
          vetCenterHoursId="vet-center-hours"
          isSatelliteLocation={isSatelliteLocation}
        />
      </Provider>,
      vetCentersHoursWidget,
    );
  }
}
