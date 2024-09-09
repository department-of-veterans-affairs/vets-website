import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createFormUploadAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    const { hasOnlineTool, formNumber } = root.dataset;

    import(/* webpackChunkName: "form-upload" */ './App').then(module => {
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
