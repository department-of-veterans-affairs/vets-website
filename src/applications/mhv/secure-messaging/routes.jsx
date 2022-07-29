import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App.jsx';

const routes = (
  <Switch>
    <Route path="/" component={App} />
    <Route path="/compose/" component={App} />
    <Route path="/reply/" component={App} />
  </Switch>
);

export default routes;
