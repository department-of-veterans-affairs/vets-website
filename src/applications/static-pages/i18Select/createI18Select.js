import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { getPageTypeFromPathname } from './utilities/helpers';
import BASE_URLS from './utilities/urls';

export default function createI18Select(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  const pageType = getPageTypeFromPathname(document?.location?.pathname);

  // do not render if not on a translatable page url
  if (!pageType) return;

  if (root) {
    import(
      /* webpackChunkName: "i18Select" */
      './I18Select'
    ).then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select baseUrls={BASE_URLS[pageType]} />
        </Provider>,
        root,
      );
    });
  }
}
