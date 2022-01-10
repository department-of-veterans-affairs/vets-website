// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  const root = document.getElementById(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "analytics-opt-out" */
    './app.js').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root,
      );
    });
  }
};
