import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import { CalculationInstructions } from './components/CalculationInstructions';

const route = [
  {
    path: '/calculation-instructions',
    component: () => <CalculationInstructions />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (_, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default route;
