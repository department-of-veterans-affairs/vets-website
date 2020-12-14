import React from 'react';
import ReactDOM from 'react-dom';

export default function createCovidVaccineUpdatesWidget(store, _widgetType) {
  const isCovidVaccineUpdatesPage =
    document.location.pathname === '/health-care/covid-19-vaccine/';

  if (!isCovidVaccineUpdatesPage) {
    return;
  }

  const introText = document.querySelector('.va-introtext')?.nextElementSibling;
  const wrapper = introText.parentNode;
  const reactRoot = document.createElement('div');

  wrapper.insertBefore(reactRoot, introText);

  if (reactRoot) {
    import(/* webpackChunkName: "CovidVaccineUpdatesCTA" */
    './widget').then(module => {
      const CovidVaccineUpdatesCTA = module.default;
      ReactDOM.render(<CovidVaccineUpdatesCTA store={store} />, reactRoot);
    });
  }
}
