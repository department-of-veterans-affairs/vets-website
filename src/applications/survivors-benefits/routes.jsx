import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import SurvivorsBenefitsApp from './containers/SurvivorsBenefitsApp';

import { ConfigProvider } from './shared/context/ConfigContext';

export const routeHoc = Component => props => (
  <ConfigProvider {...props}>
    <Component {...props} />
  </ConfigProvider>
);

const testingRoutes = [
  {
    path: '/',
    component: routeHoc(SurvivorsBenefitsApp),
    indexRoute: {
      onEnter: (nextState, replace) => replace('/introduction?loggedIn=false'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
  {
    path: '/',
    component: routeHoc(SurvivorsBenefitsApp),
    indexRoute: {
      onEnter: (nextState, replace) => replace('/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

const routes = [
  {
    path: '/',
    component: routeHoc(SurvivorsBenefitsApp),
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
  ...testingRoutes,
];

export default routes;
