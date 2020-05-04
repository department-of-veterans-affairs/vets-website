import React from 'react';
import ReactDOM from 'react-dom';

export default function create686ContentReveal(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "Form686ContentReveal" */
    './containers/Form686ContentReveal.jsx').then(module => {
      const Form686ContentReveal = module.default;
      ReactDOM.render(<Form686ContentReveal store={store} />, root);
    });
  }
}
