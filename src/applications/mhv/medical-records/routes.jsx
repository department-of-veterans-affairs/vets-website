import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MrBreadcrumbs from './containers/MrBreadcrumbs';
import App from './containers/App';

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
