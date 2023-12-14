import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';

import Avs from './containers/Avs';

const ErrorBoundaryWrapper = props => (
  <ErrorBoundary>
    <Avs {...props} />
  </ErrorBoundary>
);

const routes = [
  <Route path="/:id" key="/:id" component={ErrorBoundaryWrapper} />,
];

export default routes;
