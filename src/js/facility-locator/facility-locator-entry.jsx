import React from 'react';
import ReactDOM from 'react-dom';

import initReact from '../common/init-react';
import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';
import routes from './routes';
import { store } from './store';

require('../../sass/facility-locator.scss');

require('../login/login-entry.jsx');

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
