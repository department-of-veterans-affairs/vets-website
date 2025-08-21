/**
 * This application creates a widget for session logout modal on VA.gov
 *
 * @module platform/site-wide/logout
 */

import React from 'react';
import { Provider } from 'react-redux';

import SessionTimeoutModal from 'platform/user/authentication/components/SessionTimeoutModal';
import startReactApp from '../../startup/react';

/**
 * Sets up the session logout widget with the given store at logout-modal-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startLogoutModal(store) {
  startReactApp(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>,
    document.getElementById('logout-modal-root'),
  );
}
