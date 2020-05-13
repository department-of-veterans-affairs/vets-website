import React from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import FormQuestion from './components/FormQuestion';

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: {App} },
  childRoutes: [],
};

export default routes;
