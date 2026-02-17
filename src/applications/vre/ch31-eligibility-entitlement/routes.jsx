import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';
import MyCaseManagementHub from './containers/MyCaseManagementHub';
import CareerPlanning from './containers/CareerPlanning';

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<MyEligibilityAndBenefits />} />
      <Route path="my-case-management-hub" element={<MyCaseManagementHub />} />
      <Route path="career-planning" element={<CareerPlanning />} />
    </Route>
  </Routes>
);

export default routes;
