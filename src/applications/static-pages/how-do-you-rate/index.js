// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  // Deriving the root element where we want to mount our react app.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    import(/* webpackChunkName: "how-do-you-rate" */
    './components/App').then(module => {
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
