import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { VET_CENTER_HOURS } from '../widgetTypes';

export default async function createVetCentersHours(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="${VET_CENTER_HOURS}"]`,
  );

  if (vetCentersHoursWidget) {
    const { default: VetCenterHours } = await import('./vetCentersHours');
    ReactDOM.render(
      <Provider store={store}>
        <VetCenterHours hours={window.vetCenterHours} />
      </Provider>,
      vetCentersHoursWidget,
    );
  }
}
