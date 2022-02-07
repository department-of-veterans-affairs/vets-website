/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '../../startup/react';

export const footerElemementId = 'footerNav';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default async function startVAFooter(footerData, store, onFooterLoad) {
  const {
    default: Footer,
  } = await import(/* webpackChunkName: "va-footer" */ './components/Footer');
  startReactApp(
    <Provider store={store}>
      <Footer footerData={footerData} onFooterLoad={onFooterLoad} />
    </Provider>,
    document.getElementById(footerElemementId),
  );
}
