import React from 'react';
// import { Route } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import ErrorBoundary from './components/ErrorBoundary';

const routes = (
  <ErrorBoundary>
    <Switch>
      <Route path="/">
        <App />
      </Route>
    </Switch>
  </ErrorBoundary>
);

export default routes;
