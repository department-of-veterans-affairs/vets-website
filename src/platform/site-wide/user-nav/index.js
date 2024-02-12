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
import Main from './containers/Main';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startUserNavWidget(store) {
  const root = document.getElementById('login-root');
  const { externalApplication } = root.dataset;

  startReactApp(
    <Provider store={store}>
      <Main externalApplication={externalApplication} />
    </Provider>,
    root,
  );
}
