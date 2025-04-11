// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';

export default store => {
  const root = document.querySelector(
    `[data-widget-type="${widgetTypes.BTSSS_LOGIN}"]`,
  );
  if (root) {
    import(
      /* webpackChunkName: "btsss-login" */
      './App'
    ).then(module => {
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
