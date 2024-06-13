import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createVYEEnrollmentWidget(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "vye-enrollment-login-widget" */ './EnrollmentVerificationLogIn').then(
      module => {
        const EnrollmentVerificationLogIn = module.default;
        ReactDOM.render(
          <Provider store={store}>
            <EnrollmentVerificationLogIn />
          </Provider>,
          root,
        );
      },
    );
  }
}
