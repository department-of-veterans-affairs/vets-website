import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';
import Dashboard from './containers/Dashboard';
import LandingPage from './containers/LandingPage';
import PermissionsPage from './containers/PermissionsPage';
import POARequests from './containers/POARequests';
import SignedInViewLayout from './containers/SignedInViewLayout';
import manifest from './manifest.json';

const routes = (
  <BrowserRouter basename={manifest.rootUrl}>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<SignedInViewLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="poa-requests" element={<POARequests />} />
          <Route path="permissions" element={<PermissionsPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default routes;
