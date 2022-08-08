import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Compose from './containers/Compose';

const routes = (
  <Switch>
    <Route path="/" component={App} />
    <Route path="/compose" component={Compose} />
    <Route path="/reply" component={App} />
  </Switch>
);

export default routes;
