import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

export default function createSharableLink(store, widgetType) {
  // creates 43 renders on the corona virus FAQ page....
  const sharableLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );
  if (sharableLinks.length > 0) {
    import(/* webpackChunkName: "sharableLink" */
    './sharableLink').then(module => {
      const SharableLink = module.default;
      for (const link of sharableLinks) {
        ReactDOM.render(
          <Provider store={store}>
            {/* should the iteration be happening inside this container instead? */}
            <SharableLink dataEntityId={link.parentId} />
          </Provider>,
          link,
        );
      }
    });
  }
}
