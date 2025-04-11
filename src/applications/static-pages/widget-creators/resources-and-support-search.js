// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "resources-and-support-search" */
      'applications/resources-and-support/components/StandaloneSearchFormWidget'
    ).then(module => {
      const App = module.default;
      ReactDOM.render(<App />, root);
    });
  }
};
