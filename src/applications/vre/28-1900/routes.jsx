import React from 'react';

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import MyEligibilityAndBenefits from './containers/MyEligibilityAndBenefits';
// import ProtectedEligibilityRoute from './containers/ProtectedEligibilityRoute';
const routes = [
  {
    path: '/my-eligibility-and-benefits',
    component: () => <MyEligibilityAndBenefits />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
