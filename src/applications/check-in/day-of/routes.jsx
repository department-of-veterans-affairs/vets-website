import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckIn from './pages/CheckIn';
import Confirmation from './pages/Confirmation';
import Demographics from './pages/Demographics';
import NextOfKin from './pages/NextOfKin';
import EmergencyContact from './pages/EmergencyContact';
import Error from './pages/Error';
import SeeStaff from './pages/SeeStaff';
import Landing from './pages/Landing';
import UpdateInformationQuestion from './pages/UpdateInformationQuestion';
import ValidateVeteran from './pages/ValidateVeteran';

import withFeatureFlip from './containers/withFeatureFlip';
import withLoadedData from './containers/withLoadedData';
import withSession from './containers/withSession';
import withToken from './containers/withToken';
import withForm from './containers/withForm';
import { URLS } from '../utils/navigation/day-of';

const routes = [
  {
    path: URLS.LANDING,
    component: Landing,
  },
  {
    path: URLS.VALIDATION_NEEDED,
    component: withToken(ValidateVeteran),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.DEMOGRAPHICS,
    component: withLoadedData(withSession(Demographics)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.NEXT_OF_KIN,
    component: withLoadedData(withSession(NextOfKin)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.EMERGENCY_CONTACT,
    component: withLoadedData(withSession(EmergencyContact)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.UPDATE_INSURANCE,
    component: withLoadedData(withSession(UpdateInformationQuestion)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.DETAILS,
    component: withLoadedData(withSession(CheckIn)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.COMPLETE,
    component: withLoadedData(withSession(Confirmation)),
    permissions: {
      requiresForm: true,
    },
  },
  {
    path: URLS.SEE_STAFF,
    component: withLoadedData(withSession(SeeStaff)),
    permissions: {
      requiresForm: true,
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
          const { requiresForm } = route.permissions;
          if (requiresForm) {
            component = withForm(component);
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
