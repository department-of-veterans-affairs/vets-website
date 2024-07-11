import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import LandingPageContainer from './containers/LandingPageContainer';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const routes = (
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
);

export default routes;
