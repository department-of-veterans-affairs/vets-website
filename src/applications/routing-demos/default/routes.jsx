import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import About from './containers/About';
import App from './containers/App';
import Prescriptions from './containers/Prescriptions';

const routes = (
  <Switch>
    <Route path="/prescriptions">
      <App>
        <Prescriptions />
      </App>
    </Route>
    <Route path="/">
      <App>
        <About />
      </App>
    </Route>
    <Route>
      <PageNotFound />
    </Route>
  </Switch>
);

export default routes;
