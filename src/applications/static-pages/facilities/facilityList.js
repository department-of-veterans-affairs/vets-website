import React from 'react';
import ReactDOM from 'react-dom';
import widgetTypes from 'platform/site-wide/widgetTypes';

export default async function createFacilityListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="${widgetTypes.FACILITY_LOCATIONS_LIST}"]`,
    ),
  );

  if (widgets.length) {
    const {
      default: FacilityListWidget,
    } = await import(/* webpackChunkName: "facility-locations-list" */ './FacilityListWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <FacilityListWidget facilities={JSON.parse(el.dataset.facilities)} />,
        el,
      );
    });
  }
}
