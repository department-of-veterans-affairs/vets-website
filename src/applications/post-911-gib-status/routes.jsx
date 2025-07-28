import React from 'react';
import { Route } from 'react-router-dom';

import PrintPage from './containers/PrintPage';
import StatusPage from './containers/StatusPage';
import Post911GIBStatusApp from './containers/Post911GIBStatusApp';

const routes = (
  <Route path="/">
    <Route component={Post911GIBStatusApp} key="/main">
      <Route index component={StatusPage} key="/status" />
      <Route component={PrintPage} key="/print" path="/print" />
    </Route>
  </Route>
);

export default routes;
