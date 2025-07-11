import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createManageVADebtCTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (widgetType === 'manage-va-debt-cta' && root) {
    import('./MangeVADebtCTA').then(module => {
      const ManageVADebtCTA = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ManageVADebtCTA />
        </Provider>,
        root,
      );
    });
  }

  if (widgetType === 'dispute-debt-link' && root) {
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
