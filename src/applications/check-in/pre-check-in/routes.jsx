import React from 'react';
import { Switch, Route } from 'react-router-dom';
import environment from 'platform/utilities/environment';
import Validate from './pages/Validate';
import Introduction from './pages/Introduction';
import Demographics from './pages/Demographics';
import NextOfKin from './pages/NextOfKin';
import EmergencyContact from './pages/EmergencyContact';
import Confirmation from './pages/Confirmation';
import Landing from './pages/Landing';
import Error from './pages/Error';
import ErrorTest from './pages/ErrorTest';
import { URLS } from '../utils/navigation';

import withFeatureFlip from '../containers/withFeatureFlip';
import withAuthorization from '../containers/withAuthorization';
import withForm from '../containers/withForm';
import { withAppSet } from '../containers/withAppSet';

import AppWrapper from '../components/layout/AppWrapper';
import ErrorBoundary from '../components/errors/ErrorBoundary';

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
        const options = { isPreCheckIn: true };
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
          <AppWrapper isPreCheckIn {...props}>
            <Component {...props} />
          </AppWrapper>
          /* eslint-disable react/jsx-props-no-spreading */
        );

        return (
          <Route path={`/${route.path}`} component={WrappedComponent} key={i} />
        );
      })}
      {!environment.isProduction() && (
        <Route
          path="/sentry/test"
          // Disable for test scenario
          // eslint-disable-next-line react/jsx-no-bind
          component={() => (
            <ErrorBoundary>
              <ErrorTest />
            </ErrorBoundary>
          )}
        />
      )}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
