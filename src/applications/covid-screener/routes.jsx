import React from 'react';
import { Route } from 'react-router';
import CovidScreenerApp from './CovidScreenerApp';
import FormQuestion from './components/FormQuestion';

const routes = {
  path: '/',
  component: CovidScreenerApp,
  indexRoute: { component: {CovidScreenerApp} },
  childRoutes: [],
};

export default routes;
