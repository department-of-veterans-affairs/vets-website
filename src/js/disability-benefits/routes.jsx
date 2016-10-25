import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Scroll from 'react-scroll';

import YourClaimsPage from './containers/YourClaimsPage.jsx';
import ClaimPage from './containers/ClaimPage.jsx';
import StatusPage from './containers/StatusPage.jsx';
import FilesPage from './containers/FilesPage.jsx';
import DetailsPage from './containers/DetailsPage.jsx';
import AskVAPage from './containers/AskVAPage.jsx';
import DocumentRequestPage from './containers/DocumentRequestPage.jsx';
import TurnInEvidencePage from './containers/TurnInEvidencePage.jsx';

const scroller = Scroll.animateScroll;

const scrollToTop = () => {
  scroller.scrollToTop({
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const routes = [
  <Route
      component={YourClaimsPage}
      key="/your-claims"
      path="/your-claims"
      onEnter={scrollToTop}/>,
  <Route
      component={ClaimPage}
      key="/your-claims/:id"
      path="/your-claims/:id"
      onEnter={scrollToTop}>
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
        path="ask-va-to-decide"
        onEnter={scrollToTop}/>
    <Route
        component={TurnInEvidencePage}
        key="turn-in-evidence"
        path="turn-in-evidence"
        onEnter={scrollToTop}/>,
    <Route
        component={DocumentRequestPage}
        path="document-request/:trackedItemId"
        onEnter={scrollToTop}/>
  </Route>,
];

export default routes;
