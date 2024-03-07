import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import Layout from './containers/Layout';
import LandingPage from './containers/LandingPage';
import Dashboard from './containers/Dashboard';
import RequireAuth from './components/RequireAuth';

const routes = (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
