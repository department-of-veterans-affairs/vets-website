/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '../../startup/react';
import Main from './containers/Main';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startMegaMenuWidget(data, store) {
  const megaMenuDesktopEl = document.getElementById('mega-menu-desktop');
  const megaMenuMobileEl = document.getElementById('mega-menu-mobile');

  const megaMenuEls = [
    megaMenuMobileEl,
    megaMenuDesktopEl,
    document.getElementById('mega-menu'),
  ].filter(el => {
    return !!el;
  });

  for (const el of megaMenuEls) {
    startReactApp(
      <Provider store={store}>
        <Main megaMenuData={data} isMobile={el === megaMenuMobileEl} />
      </Provider>,
      el,
    );
  }
}
