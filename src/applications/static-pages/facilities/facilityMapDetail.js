import React from 'react';
import ReactDOM from 'react-dom';

export default async function createFacilityMapWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="facility-map"]`),
  );

  if (widgets.length) {
    const {
      default: FacilityMapWidget,
    } = await import(/* webpackChunkName: "facility-detail" */ './FacilityMapWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <FacilityMapWidget facilityId={JSON.parse(el.dataset.facility)} />,
        el,
      );
    });
  }
}
