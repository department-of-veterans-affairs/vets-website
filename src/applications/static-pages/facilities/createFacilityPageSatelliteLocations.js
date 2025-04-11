import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { fetchMultiFacility } from './actions';

export default async function createFacilityPageSatelliteLocations(store) {
  let facilityID = '';
  const mapWidgets = document.querySelectorAll(
    `[data-widget-type="${widgetTypes.FACILITY_MAP_SATELLITE_LOCATIONS}"]`,
  );
  if (mapWidgets) {
    const { default: FacilityMapWidgetDynamic } = await import(
      /* webpackChunkName: "facility-detail" */ './FacilityMapWidgetDynamic'
    );

    mapWidgets.forEach((mapWidget, index) => {
      facilityID = window.satteliteVetCenters[index];

      if (facilityID) {
        store.dispatch(fetchMultiFacility(facilityID));
        if (mapWidget) {
          ReactDOM.render(
            <Provider store={store}>
              <FacilityMapWidgetDynamic facilityID={facilityID} />
            </Provider>,
            mapWidget,
          );
        }
      }
    });
  }
}
