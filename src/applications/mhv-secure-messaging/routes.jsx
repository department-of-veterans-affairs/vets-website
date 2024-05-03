import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';

const routes = (
  <Switch>
    <Route path="/" key="App">
      <App />
    </Route>
  </Switch>
);

export default routes;
