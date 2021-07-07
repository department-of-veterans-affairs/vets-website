import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Failed from './pages/Failed';
import Insurance from './pages/Insurance';
import Landing from './pages/Landing';
import FeatureFlipTest from './pages/FeatureFlipTest';

import withNotOnProduction from './containers/withNotOnProduction';
import withFeatureFlip from './containers/withFeatureFlip';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" component={withNotOnProduction(Landing)} />
      <Route
        path="/update-information"
        component={withNotOnProduction(Insurance)}
      />
      <Route path="/details" component={withNotOnProduction(CheckIn)} />
      <Route path="/complete" component={withNotOnProduction(Confirmation)} />
      <Route path="/see-staff" component={withNotOnProduction(Failed)} />
      <Route path="/debug" component={withFeatureFlip(FeatureFlipTest)} />
    </Switch>
  );
};
export default createRoutesWithStore;
