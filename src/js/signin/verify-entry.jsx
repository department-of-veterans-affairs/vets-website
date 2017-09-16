import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import createCommonStore from '../common/store';
import reducer from '../login/reducers/login';

import Main from './containers/Main';

require('../common');  // Bring in the common javascript.
require('../../sass/login.scss');

const commonStore = createCommonStore(reducer);

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Main verify/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
