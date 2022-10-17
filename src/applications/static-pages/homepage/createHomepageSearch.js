import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createHomepageSearch(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./HomepageSearch').then(module => {
      const HomepageSearch = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <HomepageSearch />
        </Provider>,
        root,
      );
    });
  }
}
