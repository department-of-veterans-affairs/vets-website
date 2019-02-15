import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async function createCallToActionWidget(store, widgetType) {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="${widgetType}"]`),
  );

  if (widgets.length) {
    const {
      default: CallToActionWidget,
    } = await import(/* webpackChunkName: "cta-widget" */ '../../platform/site-wide/cta-widget');

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach((el, index) => {
      ReactDOM.render(
        <Provider store={store}>
          <CallToActionWidget
            appId={el.dataset.appId}
            index={index}
            setFocus={false}
          />
        </Provider>,
        el,
      );
    });
  }
}
