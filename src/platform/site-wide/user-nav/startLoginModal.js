/**
 * This application creates a widget for the login modal on VA.gov
 *
 */

import React from 'react';
import { Provider } from 'react-redux';

import SignInModal from 'platform/user/authentication/components/SignInModal';
import startReactApp from '../../startup/react';

/**
 * Sets up the SignInModal widget with the given store at login-modal-root
 *
 * @param {Redux.Store} store The common store used on the site
 */

export default function startLoginModal(store) {
  return startReactApp(
    <Provider store={store}>
      <SignInModal />
    </Provider>,
    document.getElementById('login-modal-root'),
  );
}
