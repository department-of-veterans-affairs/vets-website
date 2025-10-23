import React from 'react';
import { Route } from 'react-router';
import App from './containers/App.jsx';

const routes = [
  <Route path="/" key="/" component={App} />,
  <Route path="/:id" key="/:id" component={App} />,
  <Route path="/:id/:languageId" key="/:id/:languageId" component={App} />,
  <Route
    path="/:id/:languageId/:colorOption"
    key="/:id/:colorOption"
    component={App}
  />,
];

export default routes;
