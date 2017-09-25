import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import createCommonStore from '../common/store';

require('../common');  // Bring in the common javascript.
require('../../sass/auth.scss');

const store = createCommonStore();

function init() {
  /*
   * Invoked when the URL changes. A way to handle query
   * string data.
   *
   * Plan is to make this trigger a sort when the query
   * parameter is `sortby`.
   */

  const handleChangedURL = (event) => {
    // Here so eslint doesn’t tell us about an unused variable.
    return event;
  };
  browserHistory.listen(handleChangedURL);
  // End URL listening

  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
