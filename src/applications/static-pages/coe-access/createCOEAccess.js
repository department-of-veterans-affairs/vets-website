import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createCOEAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "chapter-31-cta" */ './COEAccess').then(
      module => {
        const COEAccess = module.default;
        ReactDOM.render(
          <Provider store={store}>
            <COEAccess />
          </Provider>,
          root,
        );
      },
    );
  }
}
