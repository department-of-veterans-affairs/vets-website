import React from 'react';
import { Route } from 'react-router';

import IntroductionPage from './containers/IntroductionPage.jsx';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionPage}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={YourClaimsPage}
      key="/your-claims"
      path="/your-claims"/>,
  <Route
      component={CompensationClaimsPage}
      key="/compensation-claims"
      path="/compensation-claims"/>,
];

export default routes;
