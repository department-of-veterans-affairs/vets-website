import '../../platform/polyfills';
import '../../sass/login.scss';

import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '../../platform/startup/react';
import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import reducer from './reducers/login';
import Main from './containers/Main';

const store = createCommonStore(reducer);

startSitewideComponents(store);

startReactApp(
  <Provider store={store}>
    <Main renderType="verifyPage" shouldRedirect/>
  </Provider>
);
