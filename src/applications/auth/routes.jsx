import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthApp from './containers/AuthApp';

const routes = (
  <Switch>
    <Route exact path="/auth/login/callback">
      <AuthApp />
    </Route>
  </Switch>
);

export default routes;
