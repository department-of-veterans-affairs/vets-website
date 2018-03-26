import '../common';
import '../../sass/login.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initCommon from '../common/init-common';
import initReact from '../common/init-react';

import reducer from './reducers/login';
import Main from './containers/Main';

const store = initCommon(reducer);

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Main renderType="verifyPage" shouldRedirect/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
