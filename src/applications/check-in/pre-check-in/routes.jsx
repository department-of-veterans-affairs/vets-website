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
import withAuthorization from './containers/withAuthorization';

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
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.NEXT_OF_KIN,
    component: NextOfKin,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.INTRODUCTION,
    component: Introduction,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.CONFIRMATION,
    component: Confirmation,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.ERROR,
    component: Error,
  },
];

const createRoutesWithStore = () => {
  return (
    <Switch>
      {routes.map((route, i) => {
        const component = route.permissions?.requireAuthorization
          ? withAuthorization(route.component)
          : route.component;
        return (
          <Route
            path={`/${route.path}`}
            component={withFeatureFlip(component)}
            key={i}
          />
        );
      })}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
