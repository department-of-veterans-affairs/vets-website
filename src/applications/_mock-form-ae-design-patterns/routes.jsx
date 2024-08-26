import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import greenFormConfig from './patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from './patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from './patterns/pattern1/TaskPurple/config/form';
import App from './App';
import { Pattern2 } from './patterns/pattern2/containers/Pattern2';
import { LandingPage } from './shared/components/pages/LandingPage';

const pattern1Routes = [
  {
    path: '/1/task-green',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/1/task-green/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(greenFormConfig),
  },
  {
    path: '/1/task-yellow',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/1/task-yellow/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(yellowFormConfig),
  },
  {
    path: '/1/task-purple',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/1/task-purple/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
];

const routes = [
  ...pattern1Routes,
  {
    path: '/2',
    component: Pattern2,
  },
  {
    path: '*',
    component: props => (
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="usa-width-two-thirds medium-8 columns">
            <LandingPage {...props} />
          </div>
        </div>
      </div>
    ),
  },
];

export default routes;
