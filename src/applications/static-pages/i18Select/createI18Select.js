import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createI18Select(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  // we can get the current lang here and pass it as a prop
  if (root) {
    import('./I18Select').then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select />
        </Provider>,
        root,
      );
    });
  }
}
