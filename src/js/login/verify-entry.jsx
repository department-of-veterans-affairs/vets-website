import '../common';
import '../../sass/login.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import createCommonStore from '../common/store';
import initReact from '../common/init-react';

import createLoginWidget from './login-entry';
import reducer from './reducers/login';
import Main from './containers/Main';

const store = createCommonStore(reducer);
createLoginWidget(store);

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Main renderType="verifyPage" shouldRedirect/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
