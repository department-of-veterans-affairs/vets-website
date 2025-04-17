import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import reducer from './reducers';

export { reducer as thirdPartyAppsReducer };

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  import(
    /* webpackChunkName: "third-party-app-directory" */ './third-party-apps-entry'
  ).then(module => {
    const { App } = module.default;
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      root,
    );
  });
};
