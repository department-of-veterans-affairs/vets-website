import React from 'react';
import ReactDOM from 'react-dom';

export default async function createBasicFacilityListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="basic-facility-locations-list"]`),
  );

  if (widgets.length) {
    const {
      default: BasicFacilityListWidget,
    } = await import(/* webpackChunkName: "basic-facility-locations-list" */ './BasicFacilityListWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <BasicFacilityListWidget
          facilities={JSON.parse(el.dataset.facilities)}
          path={el.dataset.path}
        />,
        el,
      );
    });
  }
}
