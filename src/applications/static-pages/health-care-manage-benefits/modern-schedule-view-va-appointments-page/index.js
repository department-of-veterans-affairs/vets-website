// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "modern-schedule-view-va-appointments-page" */
    './components/App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App widgetType={widgetType} />
        </Provider>,
        root,
      );
    });
  }
};
