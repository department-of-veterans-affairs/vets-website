import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Unit tests don't like @imports, so we load the sass conditionally
if (global.navigator?.userAgent !== 'node.js') {
  import('./sass/mhv-signin-cta.scss');
}

/**
 * Create the MHV Signin CTA widget on a page as needed.
 * @param {*} store the React store
 * @param {String} widgetType the widget type
 */
export default async function createMhvSigninCallToAction(store, widgetType) {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="${widgetType}"]`),
  );
  if (widgets.length) {
    const {
      default: MhvSigninCallToAction,
    } = await import(/* webpackChunkName: "mhv-signin-cta" */ 'applications/static-pages/mhv-signin-cta');

    widgets.forEach(el => {
      // Grab the content that will show if no alerts.
      const origElement = el.cloneNode(true);
      const widgetContent = origElement.getElementsByClassName(
        'static-widget-content',
      )[0];
      const serviceDescription = el.getAttribute('data-service-description');
      ReactDOM.render(
        <Provider store={store}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            noAlertContent={widgetContent}
          />
        </Provider>,
        el,
      );
    });
  }
}
