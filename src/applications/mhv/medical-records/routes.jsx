import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import MrBreadcrumbs from './containers/MrBreadcrumbs';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <Switch>
      <Route path="/" key="App">
        <App />
      </Route>
    </Switch>
  </div>
);

export default routes;
