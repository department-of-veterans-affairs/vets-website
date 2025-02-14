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
import { createShouldShowMinimalFunction } from '../header/helpers';

export const footerElemementId = 'footerNav';

export const setupMinimalFooter = () => {
  const footer = document.getElementById(footerElemementId);
  const minimalFooterData = footer?.dataset?.minimalFooter;
  const minimalFooterDataParsed = minimalFooterData
    ? JSON.parse(minimalFooterData)
    : null;

  let minimalFooterEnabled = minimalFooterDataParsed;
  let excludePaths;

  if (typeof minimalFooterDataParsed === 'object') {
    minimalFooterEnabled = minimalFooterDataParsed.enabled !== false;
    excludePaths = minimalFooterDataParsed.excludePaths;
  }

  return createShouldShowMinimalFunction({
    enabled: minimalFooterEnabled,
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
