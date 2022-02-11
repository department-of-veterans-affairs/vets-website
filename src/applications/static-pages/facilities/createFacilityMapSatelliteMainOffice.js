import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { fetchFacility } from './actions';
import widgetTypes from '../widgetTypes';

export default async function createFacilityMapSatelliteMainOffice(store) {
  let facilityID = '';

  const mapWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.FACILITY_MAP_SATELLITE_MAIN_OFFICE}"]`,
  );

  if (mapWidget && !facilityID) {
    facilityID = mapWidget.dataset.facility;
  }

  if (facilityID) {
    store.dispatch(fetchFacility(facilityID));
    if (mapWidget) {
      const {
        default: FacilityMapWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityMapSatelliteMainWidget');
      ReactDOM.render(
        <Provider store={store}>
          <FacilityMapWidget />
        </Provider>,
        mapWidget,
      );
    }
  }
}
