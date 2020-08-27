// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  console.log('I am here!', store, widgetType);
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "authenticated-homepage" */
    './components/App').then(module => {
      const App = module.default;

      console.log('This is app', App);
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root,
      );
    });
  }
};
