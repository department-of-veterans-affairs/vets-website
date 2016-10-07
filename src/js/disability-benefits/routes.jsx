import React from 'react';
import { Route } from 'react-router';

import YourClaimsPage from './containers/YourClaimsPage.jsx';
import CompensationClaimsPage from './containers/CompensationClaimsPage.jsx';
import StatusPage from './containers/StatusPage.jsx';
import FilesPage from './containers/FilesPage.jsx';
import DetailsPage from './containers/DetailsPage.jsx';
import AskVAPage from './containers/AskVAPage.jsx';

const routes = [
  // Introduction route.
  <Route
      component={YourClaimsPage}
      key="/your-claims"
      path="/your-claims"/>,
  <Route
      component={CompensationClaimsPage}
      key="/your-claims/compensation-claims/"
      path="/your-claims/compensation-claims/"/>,
  <Route
      component={StatusPage}
      key="/your-claims/status"
      path="/your-claims/status"/>,
  <Route
      component={FilesPage}
      key="/your-claims/files"
      path="/your-claims/files"/>,
  <Route
      component={DetailsPage}
      key="/your-claims/details"
      path="/your-claims/details"/>,
  <Route
      component={AskVAPage}
      key="/your-claims/ask-va-to-decide"
      path="/your-claims/ask-va-to-decide"/>,
];

export default routes;
