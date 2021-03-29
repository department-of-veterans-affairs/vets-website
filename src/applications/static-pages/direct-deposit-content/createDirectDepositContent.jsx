import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createDirectDepositContent(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "direct-deposit-content" */
    './DirectDepositContent').then(module => {
      const DirectDepositContent = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <DirectDepositContent />
        </Provider>,
        root,
      );
    });
  }
}
