import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import SignedInViewLayout from './containers/SignedInViewLayout';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route path="/" element={<LandingPage />} />
      <Route element={<SignedInViewLayout />}>
        <Route path="poa-requests" element={<POARequestsPage />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
