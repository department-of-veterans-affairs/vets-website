import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import HealthCareApp from './components/HealthCareApp.jsx';
import config from '../../config';
import reducer from './reducers';
import routes from './routes.jsx';

import menu from '../../assets/js/vendor/menu.js'; // eslint-disable-line

const store = createStore(reducer);

const browserHistory = useRouterHistory(createHistory)({
  basename: config.basePath
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={HealthCareApp}>
          <IndexRedirect to="/introduction"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

export { init };
