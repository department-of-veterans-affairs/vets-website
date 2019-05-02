import React from 'react';
import ReactDOM from 'react-dom';

export default async function createFacilityPatientSatisfactionScoresWidget() {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="facility-patient-satisfaction-scores"]`,
    ),
  );

  if (widgets.length) {
    const {
      default: FacilityPatientSatisfactionScoresWidget,
    } = await import(/* webpackChunkName: "facility-patient-satisfaction-scores" */ './FacilityPatientSatisfactionScoresWidget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <FacilityPatientSatisfactionScoresWidget
          facilityId={JSON.parse(el.dataset.facility)}
        />,
        el,
      );
    });
  }
}
