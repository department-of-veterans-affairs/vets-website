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

const store = initCommon(reducer);

const folderName = window.location.pathname.indexOf('health-care/') >= 0
  ? 'health-care'
  : 'healthcare';

const browserHistory = useRouterHistory(createHistory)({
  basename: `/${folderName}/apply/application`
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
