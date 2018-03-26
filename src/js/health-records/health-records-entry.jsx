import '../common';
import '../../sass/health-records/health-records.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducers';
import initCommon from '../common/init-common';

const store = initCommon(reducer);

const history = useRouterHistory(createHistory)({
  basename: '/health-care/health-records'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
