// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

export default (store, megaMenuData) => {
  // Derive the widget and its data properties for props.
  const root = document.querySelector(`[data-widget-type="header"]`);
  const props = root.dataset;

  // Connect feature toggles.
  connectFeatureToggle(store.dispatch);

  // Render the widget.
  if (root) {
    import(/* webpackChunkName: "header" */
    './components/App').then(module => {
      const App = module.default;

      ReactDOM.render(
        <Provider store={store}>
          <App
            megaMenuData={megaMenuData}
            show={props.show !== 'false'}
            showMegaMenu={props.showMegaMenu !== 'false'}
            showNavLogin={props.showNavLogin !== 'false'}
          />
        </Provider>,
        root,
      );
    });
  }
};
