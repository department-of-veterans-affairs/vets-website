import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Failed from './pages/Failed';
import UpdateInformationQuestion from './pages/UpdateInformationQuestion';
import Landing from './pages/Landing';
import FeatureFlipTest from './pages/FeatureFlipTest';

import withNotOnProduction from './containers/withNotOnProduction';
import withFeatureFlip from './containers/withFeatureFlip';

import { URLS } from './utils/navigation';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" component={withNotOnProduction(Landing)} />
      <Route
        path={`/${URLS.UPDATE_INSURANCE}`}
        component={withNotOnProduction(UpdateInformationQuestion)}
      />
      <Route path="/details" component={withNotOnProduction(CheckIn)} />
      <Route path="/complete" component={withNotOnProduction(Confirmation)} />
      <Route
        path={`/${URLS.SEE_STAFF}`}
        component={withNotOnProduction(Failed)}
      />
      <Route path="/debug" component={withFeatureFlip(FeatureFlipTest)} />
    </Switch>
  );
};
export default createRoutesWithStore;
