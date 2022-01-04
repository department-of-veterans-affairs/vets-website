import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Validate from './pages/Validate';
import Introduction from './pages/Introduction';
import Demographics from './pages/Demographics';
import NextOfKin from './pages/NextOfKin';
import EmergencyContact from './pages/EmergencyContact';
import Confirmation from './pages/Confirmation';
import Landing from './pages/Landing';
import Error from './pages/Error';
import { URLS } from '../utils/navigation/pre-check-in';

import withFeatureFlip from './containers/withFeatureFlip';
import withAuthorization from './containers/withAuthorization';
import withForm from './containers/withForm';

const routes = [
  {
    path: URLS.LANDING,
    component: Landing,
  },
  {
    path: URLS.VERIFY,
    component: Validate,
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.DEMOGRAPHICS,
    component: Demographics,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.NEXT_OF_KIN,
    component: NextOfKin,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.EMERGENCY_CONTACT,
    component: EmergencyContact,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.INTRODUCTION,
    component: Introduction,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.CONFIRMATION,
    component: Confirmation,
    permissions: {
      requiresForm: true,
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
        let component = route.component;
        if (route.permissions) {
          const { requiresForm, requireAuthorization } = route.permissions;
          if (requiresForm) {
            component = withForm(component);
          }
          if (requireAuthorization) {
            component = withAuthorization(component);
          }
        }

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
