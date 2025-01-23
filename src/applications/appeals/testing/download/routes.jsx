import React from 'react';
import { Router, Route } from 'react-router';

import Confirmation from './containers/Confirmation';
import ViewAppeal from './containers/ViewAppeal';

const routes = (
  <Router>
    <Route path="/" component={Confirmation} />
    <Route path="/view-appeal" component={ViewAppeal} />
  </Router>
);

export default routes;
