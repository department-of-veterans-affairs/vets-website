import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';

const routes = (
  <Routes>
    <Route element={<App />}>
      <Route path="/" element={<MyEligibilityAndBenefits />} />
    </Route>
  </Routes>
);

export default routes;
