// Node modules.
import { apiRequest } from 'platform/utilities/api';
import { initializeProfile } from 'platform/user/profile/actions';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import environment from 'platform/utilities/environment';

export default (store, widgetType) => {
  const renderApp = () => {
    const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

    if (root) {
      import(/* webpackChunkName: "1095b-download" */
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

  if (!environment.isLocalhost()) {
    renderApp();
    return;
  }

  apiRequest('/mock_session')
    .then(response => {
      if (!response?.hasSession) {
        return null;
      }

      localStorage.setItem('hasSession', true);
      return store.dispatch(initializeProfile());
    })
    .finally(renderApp);
};
