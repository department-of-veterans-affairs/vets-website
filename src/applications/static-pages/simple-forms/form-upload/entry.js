import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createFormUploadAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const { hasOnlineTool, formNumber, shouldDisplayFormUpload } = root.dataset;

  if (root) {
    import(/* webpackChunkName: "form-upload" */ './App.js').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App
            hasOnlineTool={hasOnlineTool === 'true'}
            formNumber={formNumber}
            shouldDisplayFormUpload={shouldDisplayFormUpload === 'true'}
          />
        </Provider>,
        root,
      );
    });
  }
}
