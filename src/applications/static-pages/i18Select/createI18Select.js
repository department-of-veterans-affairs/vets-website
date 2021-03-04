import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createI18Select(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  const translatableLinks = new Set([
    '/coronavirus-veteran-frequently-asked-questions/',
    '/coronavirus-veteran-frequently-asked-questions-esp/',
    '/coronavirus-veteran-frequently-asked-questions-tag/',
    '/health-care/covid-19-vaccine/',
    '/health-care/covid-19-vaccine-esp/',
    '/health-care/covid-19-vaccine-tag/',
  ]);
  const isTranslatable = translatableLinks.has(document.location.pathname);
  if (!isTranslatable) return;

  if (root) {
    import('./I18Select').then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select />
        </Provider>,
        root,
      );
    });
  }
}
