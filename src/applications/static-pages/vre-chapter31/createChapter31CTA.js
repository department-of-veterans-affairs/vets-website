import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createChapter31CTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "chapter-31-cta" */ './Chapter31CTA').then(
      module => {
        const Chapter31CTA = module.default;
        ReactDOM.render(
          <Provider store={store}>
            <Chapter31CTA />
          </Provider>,
          root,
        );
      },
    );
  }
}
