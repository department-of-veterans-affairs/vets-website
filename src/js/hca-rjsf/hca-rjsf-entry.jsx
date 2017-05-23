import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import route from './routes';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';
import reducer from './reducer';

require('../common');
require('../../sass/hca-rjsf.scss');

const store = createCommonStore(reducer);
createLoginWidget(store);

// Change the basename path once we replace hca with this form
// (should be 'healthcare/appy/application')
const browserHistory = useRouterHistory(createHistory)({
  basename: '/healthcare/rjsf'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        {route}
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
