import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function create214140Access(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "employment-questionnaire-21-4140" */ './App.js').then(
      module => {
        const App = module.default;

        ReactDOM.render(
          <Provider store={store}>
            <App />
          </Provider>,
          root,
        );
      },
    );
  }
}
