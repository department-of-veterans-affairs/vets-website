/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on Vets.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import startReactApp from '../../startup/react';
import Footer from './components/Footer';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startVAFooter(handleFooterDidMount) {
  startReactApp(
    <Footer handleFooterDidMount={handleFooterDidMount} />,
    document.getElementById('footerNav'),
  );
}
