import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import { commonStore } from '../common/store';

import Main from './containers/Main';

require('../common');  // Bring in the common javascript.
require('../../sass/login.scss');

function init() {
  /*
   * Invoked when the URL changes. A way to handle query
   * string data.
   *
   * Plan is to make this trigger a sort when the query
   * parameter is `sortby`.
   */

  ReactDOM.render((
    <Provider store={commonStore}>
      <Main/>
    </Provider>
    ), document.getElementById('login-root'));
}

initReact(init);
