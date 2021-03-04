import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createCovidVaccineUpdatesWidget(store, _widgetType) {
  const covidVaccineUpdatesPaths = new Set([
    '/health-care/covid-19-vaccine/',
    '/health-care/covid-19-vaccine-esp/',
    '/health-care/covid-19-vaccine-tag/',
  ]);
  const isCovidVaccineUpdatesPage = covidVaccineUpdatesPaths.has(
    document.location.pathname,
  );

  if (!isCovidVaccineUpdatesPage) {
    return;
  }

  const introText = document.querySelector('.va-introtext')?.nextElementSibling;
  const wrapper = introText.parentNode;
  const reactRoot = document.createElement('div');
  // TODO: this lang attribute will be set by the i18Select component
  const content = document.getElementById('content');
  const lang = content?.getAttribute('lang') || 'en';
  wrapper.insertBefore(reactRoot, introText);

  if (reactRoot) {
    import(/* webpackChunkName: "CovidVaccineUpdatesCTA" */
    './widget').then(module => {
      const CovidVaccineUpdatesCTA = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <CovidVaccineUpdatesCTA lang={lang} />
        </Provider>,
        reactRoot,
      );
    });
  }
}
