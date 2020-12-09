import React from 'react';
import ReactDOM from 'react-dom';

export default function createCovidVaccineUpdatesWidget(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "CaregiverContentToggle" */
    './widget').then(module => {
      const CovidVaccineUpdatesCTA = module.default;
      ReactDOM.render(<CovidVaccineUpdatesCTA store={store} />, root);
    });
  }
}
