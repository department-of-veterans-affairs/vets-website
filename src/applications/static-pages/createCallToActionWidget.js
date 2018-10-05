import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async function createCallToActionWidget(store) {
  const widgets = Array.from(document.querySelectorAll('.cta-widget'));

  if (widgets.length) {
    const {
      default: CallToActionWidget,
    } = await import(/* webpackChunkName: "cta-widget" */ '../../platform/site-wide/cta-widget');

    widgets.forEach((el, index) => {
      ReactDOM.render(
        <Provider store={store}>
          <CallToActionWidget appId={el.dataset.appId} index={index} />
        </Provider>,
        el,
      );
    });
  }
}
