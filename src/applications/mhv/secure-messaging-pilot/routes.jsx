import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../secure-messaging/containers/App';

const routes = (
  <Switch>
    <Route path="/" key="App">
      <App isPilot />
    </Route>
  </Switch>
);

export default routes;
