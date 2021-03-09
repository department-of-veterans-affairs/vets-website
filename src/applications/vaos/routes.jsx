import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import VAOSApp from './components/VAOSApp';
import ErrorBoundary from './components/ErrorBoundary';
import { captureError } from './utils/error';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import FullWidthLayout from './components/FullWidthLayout';
import { AppointmentList } from './appointment-list';

// Handles errors loading components by doing one page reload and showing
// an error message otherwise
function handleLoadError(err) {
  if (window.location.search?.includes('retry=1')) {
    captureError(new Error(`vaos_lazy_loading: ${err.message}`));
    return () => (
      <FullWidthLayout>
        <ErrorMessage />
      </FullWidthLayout>
    );
  } else {
    window.location.replace(`${window.location.pathname}?retry=1`);
    return () => <LoadingIndicator message="Reloading page" />;
  }
}

export default function createRoutesWithStore(store) {
  return (
    <ErrorBoundary fullWidth>
      <VAOSApp>
        <Switch>
          <Route
            path="/new-appointment"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "vaos-form" */ './new-appointment')
                .then(({ NewAppointment, reducer }) => {
                  store.injectReducer('newAppointment', reducer);
                  return NewAppointment;
                })
                .catch(handleLoadError),
            )}
          />
          <Route
            path="/new-express-care-request"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "express-care" */ './express-care')
                .then(({ NewExpressCareRequest, reducer }) => {
                  store.injectReducer('expressCare', reducer);
                  return NewExpressCareRequest;
                })
                .catch(handleLoadError),
            )}
          />
          <Route
            path="/new-covid-19-vaccine-booking"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "project-cheetah" */ './project-cheetah')
                .then(({ NewBooking, reducer }) => {
                  store.injectReducer('projectCheetah', reducer);
                  return NewBooking;
                })
                .catch(handleLoadError),
            )}
          />
          <Route path="/" component={AppointmentList} />
        </Switch>
      </VAOSApp>
    </ErrorBoundary>
  );
}
