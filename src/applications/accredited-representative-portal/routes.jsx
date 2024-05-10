import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import PermissionsPage from './containers/PermissionsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route index element={<LandingPage />} />
      <Route element={<SignedInLayoutWrapper />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="poa-requests" element={<POARequestsPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
