import 'core-js';
import '../common';
import '../../sass/user-profile.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducers';
import createCommonStore, { renderCommonComponents } from '../common/store';

const commonStore = createCommonStore(reducer);
renderCommonComponents(commonStore);

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
