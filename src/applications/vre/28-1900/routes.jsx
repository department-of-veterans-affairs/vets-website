import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';

import ProtectedEligibilityRoute from './containers/ProtectedEligibilityRoute';

const routes = [
  {
    path: '/your-eligibility-and-benefits',
    component: () => <ProtectedEligibilityRoute />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
