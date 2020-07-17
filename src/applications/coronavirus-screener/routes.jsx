import React from 'react';
import { Route } from 'react-router';
import App from './containers/App.jsx';

const routes = [
  <Route path="/" key="/" component={App} />,
  <Route path="/:id" key="/:id" component={App} />,
];

export default routes;
