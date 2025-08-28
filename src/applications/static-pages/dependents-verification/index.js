import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createDependentsVerificationHowToVerify(
  store,
  widgetType,
) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "dependents-verification-how-to-verify" */
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
}
