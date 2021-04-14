import React from 'react';
import ReactDOM from 'react-dom';

export default function createSharableLink(store, widgetType) {
  const sharableLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );
  if (sharableLinks.length > 0) {
    import(/* webpackChunkName: "sharableLink" */
    './sharableLink').then(module => {
      const SharableLink = module.default;
      for (const link of sharableLinks) {
        ReactDOM.render(
          <SharableLink dataEntityId={link.getAttribute('parentid')} />,
        );
      }
    });
  }
}
