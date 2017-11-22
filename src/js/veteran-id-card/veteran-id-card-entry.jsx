import 'core-js';
import '../common';
import '../../sass/veteran-id-card.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducers';
import initCommon from '../common/init-common';

const commonStore = initCommon(reducer);

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
