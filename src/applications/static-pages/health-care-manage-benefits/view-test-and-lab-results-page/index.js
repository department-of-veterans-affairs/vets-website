// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import { showAuthFacilityIDExceptions } from './constants';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "view-test-and-lab-results-page" */
    './components/App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App showAuthFacilityIDExceptions={showAuthFacilityIDExceptions} />
        </Provider>,
        root,
      );
    });
  }
};
