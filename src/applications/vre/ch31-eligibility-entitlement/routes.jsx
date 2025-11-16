import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import ProtectedEligibilityRoute from './containers/ProtectedEligibilityRoute';
import MyCaseManagementHub from './containers/MyCaseManagementHub';

const routes = (
  <App>
    <Switch>
      <Route
        exact
        path="/my-case-management-hub"
        component={MyCaseManagementHub}
      />
      <Route exact path="/" component={ProtectedEligibilityRoute} />
    </Switch>
  </App>
);

export default routes;
