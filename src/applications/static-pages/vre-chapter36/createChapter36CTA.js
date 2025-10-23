import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createChapter36CTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "chapter-36-cta" */ './Chapter36CTA').then(
      module => {
        const Chapter36CTA = module.default;
        ReactDOM.render(
          <Provider store={store}>
            <Chapter36CTA />
          </Provider>,
          root,
        );
      },
    );
  }
}
