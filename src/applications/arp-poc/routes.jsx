import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import Layout from './containers/Layout';
import LandingPage from './containers/LandingPage';

const routes = (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
    </Route>
  </Routes>
);

export default routes;
