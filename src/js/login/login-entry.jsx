import '../../sass/login.scss';

import React from 'react';
import startReactApp from '../../platform/startup/react';

import { Provider } from 'react-redux';

import Main from './containers/Main';

export default function createLoginWidget(store) {
  startReactApp((
    <Provider store={store}>
      <Main/>
    </Provider>
  ), document.getElementById('login-root'));
}
