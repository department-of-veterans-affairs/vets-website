import React from 'react';
import { Router, Route } from 'react-router';
import TravelPayStatusApp from './containers/TravelPayStatusApp.jsx';

const routes = (
  <Router>
    <Route path="/" component={TravelPayStatusApp} />
  </Router>
);

export default routes;
