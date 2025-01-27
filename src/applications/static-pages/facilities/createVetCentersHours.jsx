import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { standardizeDateTime } from './facilityUtilities';

export default async function createVetCentersHours(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_HOURS}"]`,
  );

  if (vetCentersHoursWidget) {
    const {
      default: VetCenterHours,
    } = await import(/* webpackChunkName: "vet-center-hours-widget" */ './vetCentersHours');
    const vetCenterHoursArray = standardizeDateTime(window.vetCenterHours);
    const { isSatelliteLocation } = window;
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
