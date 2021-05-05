import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createSharableLink(store, widgetType) {
  const sharableLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );
  const isABetaPageForTestingFeature = new Set([
    '/coronavirus-veteran-frequently-asked-questions/',
  ]);
  const isBetaPage = isABetaPageForTestingFeature.has(
    document.location.pathname,
  );
  if (!isBetaPage) return;
  if (sharableLinks.length > 0) {
    import(/* webpackChunkName: "sharableLink" */
    './sharableLink').then(module => {
      const SharableLink = module.default;
      let idx = -1;
      for (const link of sharableLinks) {
        idx++;
        ReactDOM.render(
          <Provider store={store}>
            <SharableLink
              dataEntityId={link.getAttribute('parentid')}
              idx={idx}
              key={idx}
            />
          </Provider>,
          link,
        );
      }
    });
  }
}
