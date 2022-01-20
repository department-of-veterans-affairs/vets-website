import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import widgetTypes from '../widgetTypes';
import { standardizeDateTime } from './facilityUtilities';

export default async function createVetCentersHoursThree(store) {
  const vetCentersHoursWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.VET_CENTER_HOURS_THREE}"]`,
  );

  if (vetCentersHoursWidget) {
    const { default: VetCenterHours } = await import('./vetCentersHours');
    const vetCenterHoursArray = standardizeDateTime(
      window.vetCenterHoursKey_03,
    );
    ReactDOM.render(
      <Provider store={store}>
        <VetCenterHours
          hours={vetCenterHoursArray}
          vetCenterHoursId="vet-center-hours-three"
        />
      </Provider>,
      vetCentersHoursWidget,
    );
  }
}
