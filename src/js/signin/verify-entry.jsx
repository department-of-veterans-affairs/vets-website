import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import createCommonStore from '../common/store';
import reducer from './reducers/login';

import Verify from './containers/Verify';

require('../common');  // Bring in the common javascript.
require('../../sass/login.scss');

const commonStore = createCommonStore(reducer);

export default function createLoginWidget(store, rootElementId = 'login-root') {
  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <Verify/>
      </Provider>
    ), document.getElementById(rootElementId));
  }

  initReact(init);
}

createLoginWidget(commonStore, 'react-root');
