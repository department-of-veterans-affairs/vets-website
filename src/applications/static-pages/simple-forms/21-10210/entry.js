import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function create2110210Access(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "form-21-10210" */ './App.js').then(module => {
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
