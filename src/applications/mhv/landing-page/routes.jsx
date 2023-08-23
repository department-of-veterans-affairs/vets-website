import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import LandingPage from '../medications/containers/LandingPage';

const routes = (
  <Switch>
    <Route exact path="/about-medications" key="medicationLandingPage">
      <LandingPage />
    </Route>
    <Route path="/">
      <App />
    </Route>
  </Switch>
);

export default routes;
