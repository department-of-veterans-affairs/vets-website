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
  const baseUrls = {
    faq: {
      en: '/coronavirus-veteran-frequently-asked-questions/',
      es: '/coronavirus-veteran-frequently-asked-questions-esp/',
      tag: '/coronavirus-veteran-frequently-asked-questions-tag/',
    },
    vaccine: {
      en: '/health-care/covid-19-vaccine/',
      es: '/health-care/covid-19-vaccine-esp/',
      tag: '/health-care/covid-19-vaccine-tag/',
    },
  };
  const isFaq = document.location.pathname.includes(
    `/coronavirus-veteran-frequently-asked-questions`,
  );
  const I18_CONTENT = {
    en: {
      label: 'English',
      suffix: '/',
      lang: 'en',
    },
    es: {
      onThisPage: 'En esta página',
      label: 'Español',
      suffix: '-esp/',
      lang: 'es',
    },
    tag: {
      suffix: '-tag/',
      label: 'Tagalog',
      onThisPage: 'Sa pahinang ito',
      lang: 'tl',
    },
  };

  if (root) {
    import(/* webpackChunkName: "i18Select" */
    './I18Select').then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select
            baseUrls={isFaq ? baseUrls.faq : baseUrls.vaccine}
            content={I18_CONTENT}
          />
        </Provider>,
        root,
      );
    });
  }
}
