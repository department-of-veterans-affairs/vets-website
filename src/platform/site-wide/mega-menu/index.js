/**
 * This application creates a widget for the
 * search, help, and sign-in header navigation on VA.gov
 *
 * @module platform/site-wide/login
 */

import React from 'react';
import { Provider } from 'react-redux';

import { connectDrupalSourceOfTruthCerner } from 'platform/utilities/cerner/dsot';
import startReactApp from '../../startup/react';
import Main from './containers/Main';

/**
 * Sets up the login widget with the given store at login-root
 *
 * @param {Redux.Store} store The common store used on the site
 */
export default function startMegaMenuWidget(data, store) {
  connectDrupalSourceOfTruthCerner(store.dispatch);

  startReactApp(
    <Provider store={store}>
      <Main megaMenuData={data} />
    </Provider>,
    document.getElementById('mega-menu'),
  );
}
