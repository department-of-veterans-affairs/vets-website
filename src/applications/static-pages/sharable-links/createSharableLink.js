import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createSharableLink(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const dataEntityId = root.id;
  if (root) {
    import(/* webpackChunkName: "sharableLink" */
    './sharableLink').then(module => {
      const SharableLink = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <SharableLink dataEntityId={dataEntityId} />
        </Provider>,
        root,
      );
    });
  }
}
