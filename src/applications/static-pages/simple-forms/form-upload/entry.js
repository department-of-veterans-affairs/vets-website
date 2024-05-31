import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import environment from 'platform/utilities/environment';

export default function createFormUploadAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const { hasOnlineTool, formNumber } = root.dataset;

  // TODO: Remove `environment.isStaging()` when we want to release this to production
  if (root && environment.isStaging()) {
    import(/* webpackChunkName: "form-upload" */ './App.js').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App
            hasOnlineTool={hasOnlineTool === 'true'}
            formNumber={formNumber}
          />
        </Provider>,
        root,
      );
    });
  }
}
