import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import ClaimStatusExplainerPage from './containers/pages/ClaimStatusExplainerPage';
import SubmitFlowWrapper from './containers/SubmitFlowWrapper';
import App from './containers/App';
import SmocContextProvider from './context/SmocContext';

const SmocFlow = (
  <SmocContextProvider>
    <SubmitFlowWrapper />
  </SmocContextProvider>
);

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/claims/" replace />} />
      <Route
        exact
        path="/claims/"
        title="TravelPayHome"
        element={<TravelPayStatusApp />}
      />
      <Route exact path="/help" element={<ClaimStatusExplainerPage />} />
      <Route
        exact
        path="/file-new-claim"
        element={<Navigate to="/" replace />}
      />
      <Route path="/file-new-claim/:apptId" element={SmocFlow} />
      <Route path="/claims/:id" element={<TravelClaimDetails />} />
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default routes;
