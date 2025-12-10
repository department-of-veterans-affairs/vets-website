import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function create210779Access(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "form-21-0779" */ './App').then(module => {
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
