import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { fetchFacility } from './actions';

export default async function createFacilityAppointmentWaitTimesWidget(store) {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="facility-appointment-wait-times-widget"]`,
    ),
  );

  if (widgets.length) {
    const {
      default: FacilityAppointmentWaitTimesWidget,
    } = await import(/* webpackChunkName: "facility-patient-satisfaction-scores" */ './FacilityAppointmentWaitTimesWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      store.dispatch(fetchFacility(JSON.parse(el.dataset.facility)));
      ReactDOM.render(
        <Provider store={store}>
          <FacilityAppointmentWaitTimesWidget service={el.dataset.service} />
        </Provider>,
        el,
      );
    });
  }
}
