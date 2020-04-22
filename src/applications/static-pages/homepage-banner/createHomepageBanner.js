import React from 'react';
import ReactDOM from 'react-dom';

export default function createHomepageBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "HomepageBanner" */
    './HomepageBanner').then(module => {
      const HomepageBanner = module.default;
      ReactDOM.render(<HomepageBanner />, root);
    });
  }
}
