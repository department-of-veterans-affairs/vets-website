import React from 'react';
import { Provider } from 'react-redux';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import Main from './containers/Main';

export default function startUserNavWidget(store) {
  startReactApp(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('login-root'),
  );
}
