import React from 'react';
import { Route, IndexRoute } from 'react-router';

import PrintPage from './containers/PrintPage';
import StatusPage from './containers/StatusPage';
import IntroPage from './containers/IntroPage';
import Post911GIBStatusApp from './containers/Post911GIBStatusApp';

const routes = [
  <IndexRoute key="/" component={IntroPage}/>,
  <Route
    component={Post911GIBStatusApp}
    key="/main">
    <IndexRoute
      component={StatusPage}
      key="/status"/>,
    <Route
      component={PrintPage}
      key="/print"
      path="/print"/>
  </Route>
];

export default routes;
