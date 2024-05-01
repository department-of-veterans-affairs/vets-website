import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import App from './containers/App';

const routes = (
  <>
    <MhvSecondaryNav />
    <Switch>
      <Route exact path="/" key="mhvLandingPage">
        <App />
      </Route>
      <Route>
        <PageNotFound />
      </Route>
    </Switch>
  </>
);

export default routes;
