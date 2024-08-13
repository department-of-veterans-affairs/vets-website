import React from 'react';
import { Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const routes = (
  <AppConfig>
    <Switch>
      <CompatRoute exact path="/" component={LandingPageContainer} />
      <CompatRoute exact path="/records" component={MedicalRecordsContainer} />
      <CompatRoute exact path="*" component={PageNotFound} />
    </Switch>
  </AppConfig>
);

export default routes;
