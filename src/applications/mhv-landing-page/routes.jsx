import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { Toggler } from '~/platform/utilities/feature-toggles';
import App from './containers/App';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const { mhvTransitionalMedicalRecordsLandingPage } = Toggler.TOGGLE_NAMES;

const routes = (
  <Switch>
    <Route exact path="/" key="mhvLandingPage">
      <App />
    </Route>
    <Route exact path="/records" key="mhvMedicalRecords">
      <Toggler toggleName={mhvTransitionalMedicalRecordsLandingPage}>
        <Toggler.Disabled>
          <PageNotFound />
        </Toggler.Disabled>
        <Toggler.Enabled>
          <MedicalRecordsContainer />
        </Toggler.Enabled>
      </Toggler>
    </Route>
    <Route>
      <PageNotFound />
    </Route>
  </Switch>
);

export default routes;
