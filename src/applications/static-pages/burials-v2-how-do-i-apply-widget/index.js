import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "burials-v2-how-do-i-apply-widget" */
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
