import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';
import MyCaseManagementHub from './containers/MyCaseManagementHub';
import CareerExplorationAndPlanning from './containers/CareerExplorationAndPlanning';
import OrientationToolsAndResources from './containers/OrientationToolsAndResources';

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<MyEligibilityAndBenefits />} />
      <Route path="my-case-management-hub" element={<MyCaseManagementHub />} />
      <Route
        path="career-exploration-and-planning"
        element={<CareerExplorationAndPlanning />}
      />
      <Route
        path="orientation-tools-and-resources"
        element={<OrientationToolsAndResources />}
      />
    </Route>
  </Routes>
);

export default routes;
