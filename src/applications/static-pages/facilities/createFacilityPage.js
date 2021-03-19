import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { fetchFacility } from './actions';

export default async function createFacilityPage(store) {
  let facilityID = '';
  const detailWidget = document.querySelector(
    `[data-widget-type="facility-detail"]`,
  );
  const mapWidget = document.querySelector(`[data-widget-type="facility-map"]`);
  const scoreWidget = document.querySelector(
    `[data-widget-type="facility-patient-satisfaction-scores"]`,
  );
  const waitTimeWidgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="facility-appointment-wait-times-widget"]`,
    ),
  );

  if (detailWidget) {
    facilityID = JSON.parse(detailWidget.dataset.facility);
  }
  if (mapWidget && !facilityID) {
    facilityID = JSON.parse(mapWidget.dataset.facility);
  }
  if (scoreWidget && !facilityID) {
    facilityID = JSON.parse(scoreWidget.dataset.facility);
  }
  if (waitTimeWidgets.length && !facilityID) {
    facilityID = JSON.parse(waitTimeWidgets[0].dataset.facility);
  }
  if (facilityID) {
    store.dispatch(fetchFacility(facilityID));
    if (mapWidget) {
      const {
        default: FacilityMapWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityMapWidget');
      ReactDOM.render(
        <Provider store={store}>
          <FacilityMapWidget />
        </Provider>,
        mapWidget,
      );
    }
    if (detailWidget) {
      const {
        default: FacilityDetailWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityDetailWidget');
      ReactDOM.render(
        <Provider store={store}>
          <FacilityDetailWidget />
        </Provider>,
        detailWidget,
      );
    }
    if (scoreWidget) {
      const {
        default: FacilityPatientSatisfactionScoresWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityPatientSatisfactionScoresWidget');
      ReactDOM.render(
        <Provider store={store}>
          <FacilityPatientSatisfactionScoresWidget />
        </Provider>,
        scoreWidget,
      );
    }
    if (waitTimeWidgets.length) {
      const {
        default: FacilityAppointmentWaitTimesWidget,
      } = await import(/* webpackChunkName: "facility-detail" */ './FacilityAppointmentWaitTimesWidget');

      waitTimeWidgets.forEach(el => {
        ReactDOM.render(
          <Provider store={store}>
            <FacilityAppointmentWaitTimesWidget service={el.dataset.service} />
          </Provider>,
          el,
        );
      });
    }
  }
}
