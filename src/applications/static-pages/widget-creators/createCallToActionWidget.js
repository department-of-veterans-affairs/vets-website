import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectFeatureToggle } from '~/platform/utilities/feature-toggles';

export default async function createCallToActionWidget(store, widgetType) {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="${widgetType}"]`),
  );

  if (widgets.length) {
    const { default: CallToActionWidget } = await import(
      /* webpackChunkName: "cta-widget" */ 'applications/static-pages/cta-widget'
    );

    connectFeatureToggle(store.dispatch);

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(
        <Provider store={store}>
          <CallToActionWidget appId={el.dataset.appId} setFocus={false} />
        </Provider>,
        el,
      );
    });
  }
}
