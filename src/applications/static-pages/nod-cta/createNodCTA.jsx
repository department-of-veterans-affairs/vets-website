import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import widgetTypes from '../widgetTypes';

export default async function createNoticeOfDisagreementWidget(store) {
  const root = document.querySelector(
    `[data-widget-type="${widgetTypes.FORM_10182_CTA}"]`,
  );

  if (root) {
    await import(/* webpackChunkName: "form-10182-cta" */ './NodCTA').then(
      module => {
        const { NodCTA } = module.default;
        connectFeatureToggle(store.dispatch);

        ReactDOM.render(
          <Provider store={store}>
            <NodCTA />
          </Provider>,
          root,
        );
      },
    );
  }
}
