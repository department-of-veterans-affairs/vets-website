import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import { CalculationInstructions } from './components/CalculationInstructions';
import AboutPage from './components/AboutPage';

const route = [
  {
    path: '/calculation-instructions',
    component: props => <CalculationInstructions props={props} />,
  },
  {
    path: '/',
    component: props => <AboutPage props={props} />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default route;
