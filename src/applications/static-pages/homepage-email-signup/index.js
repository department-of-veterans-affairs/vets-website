import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import EmailSignup from './EmailSignup';
import './email-signup.scss';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (!root) {
    return;
  }

  ReactDOM.render(
    <Provider store={store}>
      <EmailSignup />
    </Provider>,
    root,
  );
};
