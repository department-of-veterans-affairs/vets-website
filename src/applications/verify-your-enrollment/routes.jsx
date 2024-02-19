import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BENEFITS_PROFILE_RELATIVE_URL } from './constants';
// import App from './containers/App';
import EnrollmentVerificationPageWrapper from './containers/EnrollmentVerificationPageWrapper';
import BenefitsProfileWrapper from './containers/BenefitsProfilePageWrapper';

const routes = (
  <Switch>
    <Route
      exact
      key="EnrollmentVerificationPage"
      path="/"
      // component={EnrollmentVerificationPageWrapper}
    >
      <EnrollmentVerificationPageWrapper />
    </Route>
    <Route
      exact
      key="BenefitsProfilePage"
      path={`${BENEFITS_PROFILE_RELATIVE_URL}`}
      // component={BenefitsProfileWrapper}
    >
      <BenefitsProfileWrapper />
    </Route>
  </Switch>
);

export default routes;
