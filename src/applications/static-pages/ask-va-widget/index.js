// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "ask-va-widget" */
      './components/App'
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
