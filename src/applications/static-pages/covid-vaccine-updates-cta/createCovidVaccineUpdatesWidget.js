import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createCovidVaccineUpdatesWidget(store, _widgetType) {
  const isCovidVaccineUpdatesPage =
    document.location.pathname === '/health-care/covid-19-vaccine/';

  if (!isCovidVaccineUpdatesPage) {
    return;
  }

  const introText = document.querySelector('.va-introtext')?.nextElementSibling;
  const wrapper = introText.parentNode;
  const reactRoot = document.createElement('div');
  const content = document.getElementById('content');
  const lang = content?.getAttribute('lang');
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
