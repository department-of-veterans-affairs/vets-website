import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import greenFormConfig from './patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from './patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from './patterns/pattern1/TaskPurple/config/form';
import redTaskConfig from './patterns/pattern2/TaskRed/form/config/form';
import ezrFormConfig from './patterns/pattern1/ezr/config/form';
import App from './App';
import CoeApp from './patterns/pattern2/TaskRed/form/containers/App';
// import { Pattern2 } from './patterns/pattern2/containers/Pattern2';
import { LandingPage } from './shared/components/pages/LandingPage';
import { PatternConfigProvider } from './shared/context/PatternConfigContext';

const pattern1Routes = [
  {
    path: '/1/task-green',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-green/introduction?loggedIn=false'),
    },
    childRoutes: createRoutesWithSaveInProgress(greenFormConfig),
  },
  {
    path: '/1/task-yellow',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-yellow/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(yellowFormConfig),
  },
  {
    path: '/1/task-purple',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-purple/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
  {
    path: '/1/ezr',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/ezr/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(ezrFormConfig),
  },
];

const pattern2Routes = [
  {
    path: '/2/task-red',
    component: props => (
      <PatternConfigProvider {...props}>
        <CoeApp {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-red/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(redTaskConfig),
  },
  {
    path: '/2/task-pink',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-pink/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
  {
    path: '/2/task-orange',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-orange/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
  {
    path: '/2/task-gray',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-gray/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
];

const routes = [
  ...pattern1Routes,
  ...pattern2Routes,
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
