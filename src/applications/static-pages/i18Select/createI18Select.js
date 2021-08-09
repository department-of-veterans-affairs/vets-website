import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { BASE_URLS, TRANSLATABLE_LINKS } from './utilities/constants';

export default function createI18Select(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // do not render if not on a translatable page url
  if (!TRANSLATABLE_LINKS.has(document.location.pathname)) return;

  const isFaq = document.location.pathname.includes(
    `/coronavirus-veteran-frequently-asked-questions`,
  );

  if (root) {
    import(/* webpackChunkName: "i18Select" */
    './I18Select').then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select baseUrls={isFaq ? BASE_URLS.faq : BASE_URLS.vaccine} />
        </Provider>,
        root,
      );
    });
  }
}
