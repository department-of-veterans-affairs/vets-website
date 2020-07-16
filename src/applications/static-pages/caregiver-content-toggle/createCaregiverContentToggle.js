import React from 'react';
import ReactDOM from 'react-dom';

export default function createCaregiverContentToggle(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "CaregiverContentToggle" */
    './widget').then(module => {
      const CaregiverContentToggle = module.default;
      ReactDOM.render(<CaregiverContentToggle store={store} />, root);
    });
  }
}
