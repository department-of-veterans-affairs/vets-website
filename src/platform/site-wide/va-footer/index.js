/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '../../startup/react';
import Footer from './components/Footer';

export const footerElemementId = 'footerNav';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startVAFooter(footerData, store) {
  startReactApp(
    <Provider store={store}>
      <Footer footerData={footerData} />
    </Provider>,
    document.getElementById(footerElemementId),
  );
}
