import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { standardizeDateTime } from './facilityUtilities';

export default async function createVetCentersSatelliteLocationHours(store) {
  const vetCentersHoursWidgets = document.querySelectorAll(
    `[data-widget-type="${widgetTypes.VET_CENTER_HOURS_SATELLITE_LOCATIONS}"]`,
  );

  if (vetCentersHoursWidgets) {
    const { default: VetCenterHours } = await import('./vetCentersHours');
    vetCentersHoursWidgets.forEach((vetCentersHoursWidget, index) => {
      const myIndex = index + 1;
      const vetCenterHoursArray = standardizeDateTime(
        window[`vetCenterHoursKey_${myIndex}`],
      );
      ReactDOM.render(
        <Provider store={store}>
          <VetCenterHours
            hours={vetCenterHoursArray}
            vetCenterHoursId={`vet-center-hours-${myIndex}`}
            isSatelliteLocation
          />
        </Provider>,
        vetCentersHoursWidget,
      );
    });
  }
}
