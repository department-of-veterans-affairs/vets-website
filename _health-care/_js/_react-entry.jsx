import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, hashHistory } from 'react-router';

import HealthCareApp from './_components/_health-care-app.jsx';
import { Hello, Night } from './_components/_hello-world.jsx';

function init() {
  ReactDOM.render((
      <Router history={hashHistory}>
        <Route path="/" component={HealthCareApp}>
          <Route path="/hello" component={Hello}/>
          <Route path="/night" component={Night}/>
        </Route>
      </Router>
      ), document.getElementById('react-root'));
}

export { init };
