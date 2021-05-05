import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async function createVetCentersHours(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="vet-center-hours"]`,
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
