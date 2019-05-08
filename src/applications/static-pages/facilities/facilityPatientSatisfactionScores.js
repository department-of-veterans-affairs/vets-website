import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { fetchFacility } from './actions';

export default async function createFacilityPatientSatisfactionScoresWidget(
  store,
) {
  const widget = document.querySelector(
    `[data-widget-type="facility-patient-satisfaction-scores"]`,
  );

  if (widget) {
    const {
      default: FacilityPatientSatisfactionScoresWidget,
    } = await import(/* webpackChunkName: "facility-patient-satisfaction-scores" */ './FacilityPatientSatisfactionScoresWidget');

    // since these widgets are on content pages, we don't want to focus on them

    store.dispatch(fetchFacility(JSON.parse(widget.dataset.facility)));
    ReactDOM.render(
      <Provider store={store}>
        <FacilityPatientSatisfactionScoresWidget />
      </Provider>,
      widget,
    );
  }
}
