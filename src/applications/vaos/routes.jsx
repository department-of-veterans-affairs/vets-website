import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './containers/AppointmentsPage';
import VAOSApp from './containers/VAOSApp';
import manifest from './manifest.json';

export default function createRoutesWithStore(store) {
  return (
    <Router basename={manifest.rootUrl}>
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
                ({ NewExpressCareRequest }) => NewExpressCareRequest,
              ),
            )}
          />
          <Route path="/" component={AppointmentsPage} />
        </Switch>
      </VAOSApp>
    </Router>
  );
}
