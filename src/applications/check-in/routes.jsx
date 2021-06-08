import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Failed from './pages/Failed';
import Insurance from './pages/Insurance';
import Landing from './pages/Landing';

import withFeatureFlip from './containers/withFeatureFlip.jsx';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/:token" component={Landing} />
      <Route path="/:token/insurance" component={Insurance} />
      <Route path="/:token/details" component={withFeatureFlip(CheckIn)} />
      <Route path="/:token/confirmed" component={Confirmation} />
      <Route path="/:token/failed" component={Failed} />
    </Switch>
  );
};
export default createRoutesWithStore;
