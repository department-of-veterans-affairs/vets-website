import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import ErrorBoundary from './components/ErrorBoundary';

import Avs from './containers/Avs';

const ErrorBoundaryWrapper = props => {
  const accessGuard = useMyHealthAccessGuard();

  if (accessGuard) {
    return accessGuard;
  }

  return (
    <ErrorBoundary>
      <Avs {...props} />
    </ErrorBoundary>
  );
};

const routes = (
  <Switch>
    <Route exact path="/" key="/:id">
      <ErrorBoundaryWrapper />
    </Route>
    <Route exact path="/:id" key="/:id">
      <ErrorBoundaryWrapper />
    </Route>
    <Route key="404">
      <PageNotFound />
    </Route>
  </Switch>
);

export default routes;
