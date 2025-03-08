import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App';
import AboutPage from './components/AboutPage';

const route = [
  {
    path: '/',
    component: props => <AboutPage aboutProps={props} />,
  },
  {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default route;
