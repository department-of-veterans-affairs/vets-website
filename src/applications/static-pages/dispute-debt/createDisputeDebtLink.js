import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createDisputeDebtLink(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./DisputeDebtLink').then(module => {
      const DisputeDebtLink = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <DisputeDebtLink />
        </Provider>,
        root,
      );
    });
  }
}
