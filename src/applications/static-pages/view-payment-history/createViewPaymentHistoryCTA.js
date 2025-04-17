import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createViewPaymentHistoryCTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "view-payment-history-cta" */ './ViewPaymentHistoryCTA'
    ).then(module => {
      const ViewPaymentHistoryCTA = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ViewPaymentHistoryCTA />
        </Provider>,
        root,
      );
    });
  }
}
