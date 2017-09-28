import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/Main';
import PrintPage from './containers/PrintPage';
import StatusPage from './containers/StatusPage';

const routes = [
  <Route
    component={Main}
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
