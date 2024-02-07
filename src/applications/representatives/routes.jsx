import React from 'react';
import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';

const routes = [
  {
    path: '/dashboard',
    component: <Dashboard POApermissions />,
  },
  {
    path: '/',
    component: App,
    childRoutes: [{ indexRoute: { component: LandingPage } }],
  },
];

export default routes;
