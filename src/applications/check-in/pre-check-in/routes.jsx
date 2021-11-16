import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Validate from './pages/Validate';
import Introduction from './pages/Introduction';
import Demographics from './pages/Demographics';
import NextOfKin from './pages/NextOfKin';
import Confirmation from './pages/Confirmation';
import Landing from './pages/Landing';
import Error from './pages/Error';
import { URLS } from './utils/navigation';

import withFeatureFlip from './containers/withFeatureFlip';

const routes = [
  {
    path: URLS.LANDING,
    component: Landing,
  },
  {
    path: URLS.VERIFY,
    component: Validate,
  },
  {
    path: URLS.DEMOGRAPHICS,
    component: Demographics,
  },
  {
    path: URLS.NEXT_OF_KIN,
    component: NextOfKin,
  },
  {
    path: URLS.INTRODUCTION,
    component: Introduction,
  },
  {
    path: URLS.CONFIRMATION,
    component: Confirmation,
  },
  {
    path: URLS.ERROR,
    component: Error,
  },
];

const createRoutesWithStore = () => {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route
          path={`/${route.path}`}
          component={withFeatureFlip(route.component)}
          key={i}
        />
      ))}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
