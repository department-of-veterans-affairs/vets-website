import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Failed from './pages/Failed';
import UpdateInformationQuestion from './pages/UpdateInformationQuestion';
import Landing from './pages/Landing';

import withNotOnProduction from './containers/withNotOnProduction';
import withRequiredData from './containers/withRequiredData';

import { URLS } from './utils/navigation';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/" component={withNotOnProduction(Landing)} />
      <Route
        path={`/${URLS.UPDATE_INSURANCE}`}
        component={withNotOnProduction(
          withRequiredData(UpdateInformationQuestion),
        )}
      />
      <Route
        path={`/${URLS.DETAILS}`}
        component={withNotOnProduction(withRequiredData(CheckIn))}
      />
      <Route
        path={`/${URLS.COMPLETE}`}
        component={withNotOnProduction(withRequiredData(Confirmation))}
      />
      <Route
        path={`/${URLS.SEE_STAFF}`}
        component={withNotOnProduction(withRequiredData(Failed))}
      />
    </Switch>
  );
};
export default createRoutesWithStore;
