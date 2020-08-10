import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createChapter31Wizard(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    import(/* webpackChunkName: "Form686CTA" */
    './chapter31Wizard.jsx').then(module => {
      const Chapter31Wizard = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <Chapter31Wizard />
        </Provider>,
        root,
      );
    });
  }
}
