import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';
import MyCaseManagementHub from './containers/MyCaseManagementHub';
import CareerPlanning from './containers/CareerPlanning';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route
        path="/your-vre-eligibility"
        element={<MyEligibilityAndBenefits />}
      />

      <Route
        path="/track-your-vre-benefits/vre-benefit-status"
        element={<MyCaseManagementHub />}
      />
      <Route
        path="/track-your-vre-benefits/vre-benefit-status/career-planning"
        element={<CareerPlanning />}
      />
      <Route
        path="/track-your-vre-benefits/vre-benefit-status/:stepSlug"
        element={<MyCaseManagementHub />}
      />
    </Route>
  </Routes>
);

export default routes;
