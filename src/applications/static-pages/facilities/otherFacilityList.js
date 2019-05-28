import React from 'react';
import ReactDOM from 'react-dom';

export default async function createOtherFacilityListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="other-facility-locations-list"]`,
    ),
  );

  if (widgets.length) {
    const {
      default: OtherFacilityListWidget,
    } = await import(/* webpackChunkName: "facility-locations-list" */ './OtherFacilityListWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <OtherFacilityListWidget
          facilities={el.dataset.facilities}
        />,
        el,
      );
    });
  }
}
