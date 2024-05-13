import React from 'react';
import { Route } from 'react-router-dom';
import App from './containers/App';

const routes = (
  <Route exact path="/" key="mhvLandingPage">
    <App />
  </Route>
);

export default routes;
