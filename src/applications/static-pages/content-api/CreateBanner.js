import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';

export default function createBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./Banner').then(module => {
      const Banner = module.default;
      ReactDOM.render(<Banner />, root);
    });
  }
}
