import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createViewDependentsCTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "ViewDependentsCTA" */
      './containers/ViewDependentsCTA'
    ).then(module => {
      const ViewDependentsCTA = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ViewDependentsCTA />
        </Provider>,
        root,
      );
    });
  }
}
