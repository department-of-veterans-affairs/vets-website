import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRedirect, Route, Router, hashHistory } from 'react-router';

import HealthCareApp from './components/HealthCareApp.jsx';
import routes from './routes.jsx';

function init() {
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={HealthCareApp}>
        <IndexRedirect to="/introduction"/>
        {routes}
      </Route>
    </Router>
    ), document.getElementById('react-root'));
}

export { init };
