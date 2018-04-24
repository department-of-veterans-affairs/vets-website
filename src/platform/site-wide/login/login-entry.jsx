import React from 'react';
import { Provider } from 'react-redux';

import '../../../sass/login.scss';
import startReactApp from '../../startup/react';
import Main from './containers/Main';

export default function createLoginWidget(store) {
  startReactApp((
    <Provider store={store}>
      <Main/>
    </Provider>
  ), document.getElementById('login-root'));
}
