import '../../common';
import '../../../sass/vre.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../../common/init-react';
import route from './routes';
import initCommon from '../../common/init-common';
import reducer from './reducer';

const store = initCommon(reducer);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/employment/vocational-rehab-and-employment/application/chapter31'
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
