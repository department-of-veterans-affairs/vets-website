import '../common';
import '../../sass/rx/rx.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducers';
import initCommon from '../common/init-common';
import manifest from './manifest.json';

const store = initCommon(reducer);

const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
