import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';

import LandingPage from './../components/LandingPage';
import Page2 from './../components/Page2';
import RoadrunnerApp from './../components/RoadrunnerApp';

function init() {
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route component={RoadrunnerApp} path="/rx/">
        <Route component={LandingPage} path="/rx/landing"/>
        <Route component={Page2} path="/rx/page2"/>
      </Route>
    </Router>
    ), document.getElementById('main'));
}

export { init };
