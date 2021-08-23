/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import startReactApp from '../../startup/react';
import Main from './containers/Main';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startMegaMenuWidget(data, store) {
  let prevMediaQueryMatch = window.matchMedia('(max-width: 767px)').matches;
  const megaMenuDesktopEl = document.getElementById('mega-menu-desktop');
  const megaMenuMobileEl = document.getElementById('mega-menu-mobile');

  const megaMenuEls = [
    prevMediaQueryMatch ? megaMenuMobileEl : megaMenuDesktopEl,
    document.getElementById('mega-menu'),
  ].filter(el => {
    return !!el;
  });

  for (const el of megaMenuEls) {
    startReactApp(
      <Provider store={store}>
        <Main megaMenuData={data} />
      </Provider>,
      el,
    );
  }

  const handleResize = () => {
    const mobileMediaQueryMatch = window.matchMedia('(max-width: 767px)')
      .matches;

    if (mobileMediaQueryMatch && !prevMediaQueryMatch) {
      if (megaMenuDesktopEl) {
        ReactDOM.unmountComponentAtNode(megaMenuDesktopEl);
        megaMenuDesktopEl.innerHTML = '';
      }

      if (megaMenuMobileEl) {
        startReactApp(
          <Provider store={store}>
            <Main megaMenuData={data} />
          </Provider>,
          megaMenuMobileEl,
        );
      }
    } else if (!mobileMediaQueryMatch && prevMediaQueryMatch) {
      if (megaMenuMobileEl) {
        ReactDOM.unmountComponentAtNode(megaMenuMobileEl);
        megaMenuMobileEl.innerHTML = '';
      }

      if (megaMenuDesktopEl) {
        startReactApp(
          <Provider store={store}>
            <Main megaMenuData={data} />
          </Provider>,
          megaMenuDesktopEl,
        );
      }
    }

    prevMediaQueryMatch = mobileMediaQueryMatch;

    return window.removeEventListener('resize', handleResize);
  };

  window.addEventListener('resize', handleResize);
}
