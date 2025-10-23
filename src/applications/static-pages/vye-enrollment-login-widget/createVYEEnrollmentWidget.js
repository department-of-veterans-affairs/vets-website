import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createVYEEnrollmentWidget(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "vye-enrollment-login-widget" */ './VyeEnrollmentLoginWidget').then(
      module => {
        const VyeEnrollmentLoginWidget = module.default;
        ReactDOM.render(
          <Provider store={store}>
            <VyeEnrollmentLoginWidget />
          </Provider>,
          root,
        );
      },
    );
  }
}
