import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// We don't want to import the stylesheet in unit tests when the widget
//   is imported into other apps. Mocha and Babel will try to load the
//   file as if it's a js file and throw syntax errors.
if (process.env.NODE_ENV !== 'test') {
  require('./stylesheet.scss');
}

export default (store, widgetType, baseHeader = 3, verbose = true) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "representative-status" */
      './components/App'
    ).then(module => {
      const App = module.default;

      ReactDOM.render(
        <Provider store={store}>
          <App baseHeader={baseHeader} verbose={verbose} />
        </Provider>,
        root,
      );
    });
  }
};
