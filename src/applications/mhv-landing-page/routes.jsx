/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';
import MhvMedcationsRoutes from '../mhv-medications/routes';
import MhvSecureMessagingRoutes from '../mhv-secure-messaging/routes';
import AppointmentsRoutes from '../vaos/routes';
import MedicalRecordsRoutes from '../mhv-medical-records/routes';

const routes = (
  <AppConfig>
    <Switch>
      <Route exact path="/" key="mhvLandingPage">
        <LandingPageContainer />
      </Route>
      <Route
        exact
        path={['/my-medications', '/my-medications/*']}
        key="mhvMedications"
      >
        {MhvMedcationsRoutes}
      </Route>
      <Route
        exact
        path={['/my-secure-messages', '/my-secure-messages/*']}
        key="mhvSecureMessages"
      >
        {MhvSecureMessagingRoutes}
      </Route>
      <Route
        exact
        path={['/my-appointments', '/my-appointments/*']}
        key="appointments"
      >
        {AppointmentsRoutes}
      </Route>
      <Route
        exact
        path={['/my-medical-records', '/my-medical-records/*']}
        key="medical-records"
      >
        {MedicalRecordsRoutes}
      </Route>
      <Route>
        <PageNotFound />
      </Route>
    </Switch>
  </AppConfig>
);

export default routes;
