import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';
// import ProtectedEligibilityRoute from './containers/ProtectedEligibilityRoute';

const routes = (
  <App>
    <Switch>
      <Route exact path="/" component={MyEligibilityAndBenefits} />
    </Switch>
  </App>
);

export default routes;
