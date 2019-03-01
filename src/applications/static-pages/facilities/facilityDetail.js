import React from 'react';
import ReactDOM from 'react-dom';

export default async function createFacilityDetailWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="facility-detail"]`),
  );

  if (widgets.length) {
    const {
      default: FacilityDetailWidget,
    } = await import(/* webpackChunkName: "facility-detail" */ './FacilityDetailWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <FacilityDetailWidget facilityId={JSON.parse(el.dataset.facility)} />,
        el,
      );
    });
  }
}
