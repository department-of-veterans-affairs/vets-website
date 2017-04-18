import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// import HealthCareApp from './components/HealthCareApp.jsx';
import initReact from '../common/init-react';
import createRoutes from './routes';
import reducer from './reducers';

require('../common');
require('../../sass/hca.scss');

require('../login/login-entry.jsx');

const store = createStore(reducer);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/healthcare/rjsf/apply/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        {createRoutes(store)}
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
