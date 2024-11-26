import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import POARequestDetails from './containers/POARequestDetails';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route index element={<LandingPage />} />
      <Route element={<SignedInLayoutWrapper />}>
        <Route path="poa-requests" element={<POARequestsPage />} />
        <Route path="poa-requests/:id" element={<POARequestDetails />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
