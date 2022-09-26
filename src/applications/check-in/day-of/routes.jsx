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
import TravelMilage from './pages/TravelMilage';

import withFeatureFlip from '../containers/withFeatureFlip';
import withForm from '../containers/withForm';
import withAuthorization from '../containers/withAuthorization';
import { withAppSet } from '../containers/withAppSet';
import { URLS } from '../utils/navigation';

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
    path: URLS.TRAVEL_MILAGE,
    component: TravelMilage,
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
        let component = props => (
          /* eslint-disable react/jsx-props-no-spreading */
          <ErrorBoundary {...props}>
            <route.component {...props} />
          </ErrorBoundary>
          /* eslint-disable react/jsx-props-no-spreading */
        );
        if (route.permissions) {
          const { requiresForm, requireAuthorization } = route.permissions;
          if (requiresForm) {
            component = withForm(component, options);
          }
          if (requireAuthorization) {
            component = withAuthorization(component, options);
          }
        }
        // Add feature flip
        component = withFeatureFlip(component, options);
        // Add app name
        component = withAppSet(component, options);

        return <Route path={`/${route.path}`} component={component} key={i} />;
      })}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
