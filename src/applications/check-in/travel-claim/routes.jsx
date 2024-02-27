import React from 'react';
import { Route, Switch } from 'react-router-dom';

import withFeatureFlip from '../containers/withFeatureFlip';
import withAuthorization from '../containers/withAuthorization';
import { withError } from '../containers/withError';
import { withAppSet } from '../containers/withAppSet';
import { URLS } from '../utils/navigation';
import { APP_NAMES } from '../utils/appConstants';
import ReloadWrapper from '../components/layout/ReloadWrapper';
import ErrorBoundary from '../components/errors/ErrorBoundary';

import Validate from './pages/validate';
import Landing from './pages/landing';
import TravelIntro from './pages/travel-intro';
import SelectAppointment from './pages/select-appointment';
import TravelMileage from './pages/travel-mileage';
import TravelVehiclePage from './pages/travel-vehicle';
import TravelAddressPage from './pages/travel-address';
import TravelReviewPage from './pages/travel-review';
import Complete from './pages/complete';

const routes = [
  {
    path: URLS.LANDING,
    component: Landing,
  },
  {
    path: URLS.VALIDATION_NEEDED,
    component: Validate,
  },
  {
    path: URLS.TRAVEL_INTRO,
    component: TravelIntro,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_SELECT,
    component: SelectAppointment,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_MILEAGE,
    component: TravelMileage,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_VEHICLE,
    component: TravelVehiclePage,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_ADDRESS,
    component: TravelAddressPage,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.TRAVEL_REVIEW,
    component: TravelReviewPage,
    permissions: {
      requireAuthorization: true,
    },
  },
  {
    path: URLS.COMPLETE,
    component: Complete,
    permissions: {
      requireAuthorization: true,
    },
  },
];

const createRoutesWithStore = () => {
  return (
    <Switch>
      {routes.map((route, i) => {
        const options = {
          // @TODO Refactor out this isPreCheckIn concept, will be important when we get to session work
          isPreCheckIn: false,
          appName: APP_NAMES.TRAVEL_CLAIM,
        };
        let Component = props => (
          /* eslint-disable react/jsx-props-no-spreading */
          <ErrorBoundary {...props}>
            <route.component {...props} />
          </ErrorBoundary>
          /* eslint-disable react/jsx-props-no-spreading */
        );
        if (route.permissions) {
          const { requireAuthorization } = route.permissions;
          if (requireAuthorization) {
            Component = withAuthorization(Component, options);
          }
        }
        // Add feature flip
        Component = withFeatureFlip(Component, options);
        // Add app name
        Component = withAppSet(Component, options);
        // Catch Errors
        Component = withError(Component);

        const WrappedComponent = props => {
          /* eslint-disable react/jsx-props-no-spreading */
          if (route.reloadable) {
            // If the page is able to restore state on reload add the wrapper.
            return (
              <ReloadWrapper isPreCheckIn={false} {...props}>
                <Component {...props} />
              </ReloadWrapper>
            );
          }
          return <Component {...props} />;
          /* eslint-disable react/jsx-props-no-spreading */
        };
        return (
          <Route path={`/${route.path}`} key={i} component={WrappedComponent} />
        );
      })}
      <Route path="*" component={Error} />
    </Switch>
  );
};
export default createRoutesWithStore;
