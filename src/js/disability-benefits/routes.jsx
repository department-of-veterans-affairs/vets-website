import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import YourClaimsPage from './containers/YourClaimsPage.jsx';
import ClaimPage from './containers/ClaimPage.jsx';
import StatusPage from './containers/StatusPage.jsx';
import FilesPage from './containers/FilesPage.jsx';
import DetailsPage from './containers/DetailsPage.jsx';
import AskVAPage from './containers/AskVAPage.jsx';
import DocumentRequestPage from './containers/DocumentRequestPage.jsx';
import TurnInEvidencePage from './containers/TurnInEvidencePage.jsx';

const routes = [
  <Route
      component={YourClaimsPage}
      key="/your-claims"
      path="/your-claims"/>,
  <Route
      component={ClaimPage}
      key="/your-claims/:id"
      path="/your-claims/:id">
    <IndexRedirect to="status"/>
    <Route
        component={StatusPage}
        path="status"/>,
    <Route
        component={FilesPage}
        path="files"/>,
    <Route
        component={DetailsPage}
        path="details"/>,
    <Route
        component={AskVAPage}
        path="ask-va-to-decide"/>
    <Route
        component={TurnInEvidencePage}
        key="turn-in-evidence"
        path="turn-in-evidence"/>,
    <Route
        component={DocumentRequestPage}
        path="document-request/:trackedItemId"/>
  </Route>,
];

export default routes;
