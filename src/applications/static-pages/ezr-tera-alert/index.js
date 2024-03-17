// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "ezr-tera-alert" */
    './components/App').then(module => {
      const App = module.default;
      connectFeatureToggle(store.dispatch);

      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root,
      );
    });
  }
};
