import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function create1010DAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "form1010d" */ './App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root,
      );
    });
  }
}
