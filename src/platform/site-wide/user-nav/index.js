/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

// necessary styles for the search dropdown component
import 'applications/search/components/SearchDropdown/SearchDropdownStyles.scss';
import './sass/user-nav.scss';
import startReactApp from '../../startup/react';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default async function startUserNavWidget(store) {
  connectFeatureToggle(store.dispatch);

  const {
    default: Main,
  } = await import(/* user-nav-widget */ './containers/Main');
  startReactApp(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('login-root'),
  );
}
