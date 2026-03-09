import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import App from './containers/App';
import MyCaseManagementHub from './containers/MyCaseManagementHub';
import CareerPlanning from './containers/CareerPlanning';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route path="/" element={<MyCaseManagementHub />} />
      <Route path="/career-planning" element={<CareerPlanning />} />
      <Route path="/:stepSlug" element={<MyCaseManagementHub />} />
    </Route>
  </Routes>
);

export default routes;
