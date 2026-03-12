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
import { createShouldShowMinimal } from '../header/helpers';

export const footerElemementId = 'footerNav';

export const setupMinimalFooter = () => {
  const footerMinimal = document.querySelector('#footer-minimal');
  let excludePaths;
  let enabled = false;

  if (footerMinimal) {
    enabled = true;
    if (footerMinimal.dataset?.excludePaths) {
      excludePaths = JSON.parse(footerMinimal.dataset.excludePaths);
    }
  }

  return createShouldShowMinimal({
    enabled,
    excludePaths,
  });
};

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startVAFooter(footerData, store, onFooterLoad) {
  startReactApp(
    <Provider store={store}>
      <Footer
        footerData={footerData}
        onFooterLoad={onFooterLoad}
        showMinimalFooter={setupMinimalFooter()}
      />
    </Provider>,
    document.getElementById(footerElemementId),
  );
}
