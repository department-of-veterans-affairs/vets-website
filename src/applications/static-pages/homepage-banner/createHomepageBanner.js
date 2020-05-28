import React from 'react';
import ReactDOM from 'react-dom';
import HomepageBanner from './HomepageBanner';

export default function createHomepageBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    const data = root.dataset;
    ReactDOM.render(<HomepageBanner {...data} />, root);
  }
}
