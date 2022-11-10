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
import ValidateVeteran from './pages/ValidateVeteran';
import LoadingPage from './pages/LoadingPage';
import TravelQuestion from './pages/TravelQuestion';
import TravelVehicle from './pages/TravelVehicle';
import TravelAddress from './pages/TravelAddress';
import TravelMileage from './pages/TravelMileage';

import withFeatureFlip from '../containers/withFeatureFlip';
import withForm from '../containers/withForm';
import withAuthorization from '../containers/withAuthorization';
import { withAppSet } from '../containers/withAppSet';
import { URLS } from '../utils/navigation';

import AppWrapper from '../components/layout/AppWrapper';
import ErrorBoundary from '../components/errors/ErrorBoundary';

const routes = [
  {
    path: URLS.LANDING,
    component: Landing,
  },
  {
    path: URLS.VALIDATION_NEEDED,
    component: ValidateVeteran,
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
    path: URLS.DETAILS,
    component: CheckIn,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.COMPLETE,
    component: Confirmation,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.SEE_STAFF,
    component: SeeStaff,

    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.LOADING,
    component: LoadingPage,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_QUESTION,
    component: TravelQuestion,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_VEHICLE,
    component: TravelVehicle,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_ADDRESS,
    component: TravelAddress,
    permissions: {
      requiresForm: true,
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_MILEAGE,
    component: TravelMileage,
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
        const options = { isPreCheckIn: false };
        let Component = props => (
          /* eslint-disable react/jsx-props-no-spreading */
          <ErrorBoundary {...props}>
            <route.component {...props} />
          </ErrorBoundary>
          /* eslint-disable react/jsx-props-no-spreading */
        );
        if (route.permissions) {
          const { requiresForm, requireAuthorization } = route.permissions;
          if (requiresForm) {
            Component = withForm(Component, options);
          }
          if (requireAuthorization) {
            Component = withAuthorization(Component, options);
          }
        }
        // Add feature flip
        Component = withFeatureFlip(Component, options);
        // Add app name
        Component = withAppSet(Component, options);

        const WrappedComponent = props => (
          /* eslint-disable react/jsx-props-no-spreading */
          <AppWrapper {...props}>
            <Component {...props} />
          </AppWrapper>
          /* eslint-disable react/jsx-props-no-spreading */
        );
        return (
          <Route path={`/${route.path}`} key={i} component={WrappedComponent} />
        );
      })}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
