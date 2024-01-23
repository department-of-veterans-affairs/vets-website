import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import ErrorBoundary from './components/ErrorBoundary';

const routes = (
  <Switch>
    <Route exact path="/" key="mhvLandingPage">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Route>
  </Switch>
);

export default routes;
