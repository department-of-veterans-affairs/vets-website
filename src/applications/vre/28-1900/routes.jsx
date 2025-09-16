import React from 'react';

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import CheckEligibilityAndApply from './containers/CheckEligibilityAndApply';

const routes = [
  {
    path: '/check-eligibility-and-apply',
    component: () => <CheckEligibilityAndApply />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
