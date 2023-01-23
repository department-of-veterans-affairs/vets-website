import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createEducationLettersLoginWidget(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./LoginWidget').then(module => {
      const LoginWidget = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <LoginWidget />
        </Provider>,
        root,
      );
    });
  }
}
