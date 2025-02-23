import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "appoint-a-rep-landing-content" */
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
