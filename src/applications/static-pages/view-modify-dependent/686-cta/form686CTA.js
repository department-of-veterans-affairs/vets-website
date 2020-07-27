import React from 'react';
import ReactDOM from 'react-dom';

export default function form686CTA(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "Form686CTA" */
    './containers/Form686CTA.jsx').then(module => {
      const Form686CTA = module.default;
      ReactDOM.render(<Form686CTA store={store} />, root);
    });
  }
}
