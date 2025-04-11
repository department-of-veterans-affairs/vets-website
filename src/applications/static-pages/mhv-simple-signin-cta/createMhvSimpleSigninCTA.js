import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/**
 * Create the MHV Signin CTA widget on a page as needed.
 * @param {*} store the React store
 * @param {String} widgetType the widget type
 */
export default async function createMhvSimpleSigninCallToAction(
  store,
  widgetType,
) {
  const widgets = Array.from(
    document.querySelectorAll(`[data-widget-type="${widgetType}"]`),
  );
  if (widgets.length) {
    const { default: MhvSimpleSigninCallToAction } = await import(
      /* webpackChunkName: "mhv-simple-signin-cta" */ 'applications/static-pages/mhv-simple-signin-cta'
    );

    widgets.forEach(el => {
      const serviceDescription = el.getAttribute('data-service-description');
      const headingLevel = el.getAttribute('data-heading-level');
      ReactDOM.render(
        <Provider store={store}>
          <MhvSimpleSigninCallToAction
            headingLevel={headingLevel}
            serviceDescription={serviceDescription}
          />
        </Provider>,
        el,
      );
    });
  }
}
