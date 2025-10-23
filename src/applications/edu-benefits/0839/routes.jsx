import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import YellowRibbonInstructionsPage from './components/YellowRibbonInstructionsPage';

const routes = [
  {
    path: '/yellow-ribbon-instructions',
    component: () => <YellowRibbonInstructionsPage />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
