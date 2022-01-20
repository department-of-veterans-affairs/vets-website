/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '../../startup/react';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default async function startMegaMenuWidget(data, store) {
  const {
    default: Main,
  } = await import(/* mega-menu-widget */ './containers/Main');

  startReactApp(
    <Provider store={store}>
      <Main megaMenuData={data} />
    </Provider>,
    document.getElementById('mega-menu'),
  );
}
