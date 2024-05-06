import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import App from './containers/App';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const routes = (
  <Switch>
    <Route exact path="/" key="mhvLandingPage">
      <App />
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
