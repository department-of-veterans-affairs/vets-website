import '../../platform/polyfills';
import '../../sass/auth.scss';

import React from 'react';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import startReactApp from '../../platform/startup/react';
import createCommonStore from '../../platform/startup/store';
import routes from './routes';
import createLoginWidget from '../login/login-entry';

const store = createCommonStore();
createLoginWidget(store);

startReactApp(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>
);
