import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './containers/AppointmentsPage';
import VAOSApp from './containers/VAOSApp';
import ErrorBoundary from './components/ErrorBoundary';

export default function createRoutesWithStore(store) {
  return (
    <ErrorBoundary>
      <VAOSApp>
        <Switch>
          <Route
            path="/new-appointment"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "vaos-form" */ './new-appointment').then(
                ({ NewAppointment, reducer }) => {
                  store.injectReducer('newAppointment', reducer);
                  return NewAppointment;
                },
              ),
            )}
          />
          <Route
            path="/new-express-care-request"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "express-care" */ './express-care').then(
                ({ NewExpressCareRequest, reducer }) => {
                  store.injectReducer('expressCare', reducer);
                  return NewExpressCareRequest;
                },
              ),
            )}
          />
          <Route path="/" component={AppointmentsPage} />
        </Switch>
      </VAOSApp>
    </ErrorBoundary>
  );
}
