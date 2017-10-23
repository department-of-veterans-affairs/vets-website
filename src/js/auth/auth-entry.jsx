import 'core-js';
import '../common';
import '../../sass/auth.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';

const store = createCommonStore();
createLoginWidget(store);

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
