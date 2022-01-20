import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import widgetTypes from '../widgetTypes';
import { standardizeDateTime } from './facilityUtilities';

export default async function createVetCentersHoursOne(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_HOURS_ONE}"]`,
  );

  if (vetCentersHoursWidget) {
    const { default: VetCenterHours } = await import('./vetCentersHours');
    const vetCenterHoursArray = standardizeDateTime(
      window.vetCenterHoursKey_01,
    );
    ReactDOM.render(
      <Provider store={store}>
        <VetCenterHours
          hours={vetCenterHoursArray}
          vetCenterHoursId="vet-center-hours-one"
        />
      </Provider>,
      vetCentersHoursWidget,
    );
  }
}
