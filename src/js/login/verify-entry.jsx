import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import createCommonStore from '../common/store';
import reducer from './reducers/login';

import Main from './containers/Main';

require('../common');  // Bring in the common javascript.
require('../../sass/login.scss');

const commonStore = createCommonStore(reducer);

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Main renderType="verifyPage"/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
