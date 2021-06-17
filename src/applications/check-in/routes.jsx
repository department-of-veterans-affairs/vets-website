import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Failed from './pages/Failed';
import Insurance from './pages/Insurance';
import Landing from './pages/Landing';

import withNotOnProduction from './containers/withNotOnProduction';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/:token" component={withNotOnProduction(Landing)} />
      <Route
        path="/:token/insurance"
        component={withNotOnProduction(Insurance)}
      />
      <Route path="/:token/details" component={withNotOnProduction(CheckIn)} />
      <Route
        path="/:token/confirmed"
        component={withNotOnProduction(Confirmation)}
      />
      <Route path="/:token/failed" component={withNotOnProduction(Failed)} />
    </Switch>
  );
};
export default createRoutesWithStore;
