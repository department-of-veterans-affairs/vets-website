/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';
import MhvMedcationsRoutes from '../mhv-medications/routes';
import MhvSecureMessagingRoutes from '../mhv-secure-messaging/routes';

const routes = (
  <AppConfig>
    <Switch>
      <Route exact path="/" key="mhvLandingPage">
        <LandingPageContainer />
      </Route>
      <Route exact path="/records" key="mhvMedicalRecords">
        <MedicalRecordsContainer />
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

      <Route>
        <PageNotFound />
      </Route>
    </Switch>
  </AppConfig>
);

export default routes;
