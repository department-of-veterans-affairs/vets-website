import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createCallToActionWidget(store) {
  const widgets = Array.from(document.querySelectorAll('.cta-widget'));

  if (widgets.length) {
    widgets.forEach(async el => {
      await import('../../platform/site-wide/cta-widget/sass/cta-widget.scss');

      const {
        default: CallToActionWidget,
      } = await import('../../platform/site-wide/cta-widget');

      ReactDOM.render(
        <Provider store={store}>
          <CallToActionWidget appId={el.dataset.appId} />
        </Provider>,
        el,
      );
    });
  }
}
