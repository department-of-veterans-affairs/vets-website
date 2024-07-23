import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const routes = (
  <AppConfig>
    <Switch>
      <Route exact path="/" key="mhvLandingPage">
        <LandingPageContainer />
      </Route>
      <Route exact path="/records" key="mhvMedicalRecords">
        <MedicalRecordsContainer />
      </Route>
      <Route>
        <PageNotFound />
      </Route>
    </Switch>
  </AppConfig>
);

export default routes;
