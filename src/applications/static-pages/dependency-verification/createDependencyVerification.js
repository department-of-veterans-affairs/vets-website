import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createDependencyVerification(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "DependencyVerification" */
      './components/dependencyVerificationModal.jsx'
    ).then(module => {
      const DependencyVerification = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <DependencyVerification />
        </Provider>,
        root,
      );
    });
  }
}
