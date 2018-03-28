import '../common';
import '../../sass/hca.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import route from './routes';
import initCommon from '../common/init-common';
import reducer from './reducer';
import manifest from './manifest.json';

const store = initCommon(reducer);

let rootUrl = manifest.rootUrl;
if (window.location.pathname.indexOf('healthcare/') >= 0) {
  rootUrl = rootUrl.replace('health-care/', 'healthcare/');
}

const browserHistory = useRouterHistory(createHistory)({
  basename: rootUrl
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
