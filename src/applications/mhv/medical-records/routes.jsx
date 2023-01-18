import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Vaccines from './containers/Vaccines';

const routes = (
  <Switch>
    <Route exact path="/" key="App">
      <App />
    </Route>
    <Route exact path="/vaccines" key="Vaccines">
      <Vaccines />
    </Route>
  </Switch>
);

export default routes;
