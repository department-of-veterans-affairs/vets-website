import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';

import LandingPage from './components/LandingPage';
import Page2 from './components/Page2';
import RoadrunnerApp from './components/RoadrunnerApp';

function init() {
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route component={RoadrunnerApp} path="/">
        <Route component={LandingPage} path="/landing"/>
        <Route component={Page2} path="/page2"/>
      </Route>
    </Router>
    ), document.getElementById('react-root'));
}

export { init };
