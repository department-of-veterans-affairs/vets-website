import React from 'react';
import { Route } from 'react-router';

import PrintPage from './containers/PrintPage';

const routes = [
  <Route
      component={PrintPage}
      key="/print"
      path="/print"/>
];

export default routes;
