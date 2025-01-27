import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { fetchMainSatelliteLocationFacility } from './actions';

export default async function createFacilityMapSatelliteMainOffice(store) {
  let facilityID = '';

  const mapWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.FACILITY_MAP_SATELLITE_MAIN_OFFICE}"]`,
  );

  if (mapWidget && !facilityID) {
    facilityID = mapWidget.dataset.facility;
  }

  if (facilityID) {
    store.dispatch(fetchMainSatelliteLocationFacility(facilityID));
    if (mapWidget) {
      const {
        default: FacilityMapSatelliteMainWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityMapSatelliteMainWidget');
      ReactDOM.render(
        <Provider store={store}>
          <FacilityMapSatelliteMainWidget facilityID={facilityID} />
        </Provider>,
        mapWidget,
      );
    }
  }
}
