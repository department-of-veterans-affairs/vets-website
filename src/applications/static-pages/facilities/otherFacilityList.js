import React from 'react';
import ReactDOM from 'react-dom';
import widgetTypes from 'platform/site-wide/widgetTypes';

export default async function createOtherFacilityListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="${widgetTypes.OTHER_FACILITY_LOCATIONS_LIST}"]`,
    ),
  );

  if (widgets.length) {
    const { default: OtherFacilityListWidget } = await import(
      /* webpackChunkName: "other-facility-locations-list" */ './OtherFacilityListWidget'
    );

    widgets.forEach(el => {
      ReactDOM.render(
        <OtherFacilityListWidget facilities={el.dataset.facilities} />,
        el,
      );
    });
  }
}
