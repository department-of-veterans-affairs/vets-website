import React from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import greenFormConfig from './patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from './patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from './patterns/pattern1/TaskPurple/config/form';
import ezrFormConfig from './patterns/pattern1/ezr/config/form';

import grayTaskConfig from './patterns/pattern2/TaskGray/form/config/form';
import CoeApp from './patterns/pattern2/TaskGray/form/containers/App';
import Form1990Entry from './patterns/pattern2/TaskOrange/Form1990App';
import blueFormConfig from './patterns/pattern2/TaskBlue/config/form';
import { formConfigForOrangeTask } from './patterns/pattern2/TaskOrange/config/form';

import App from './App';
import ReviewPage from './patterns/pattern2/post-study/ReviewPage';

import { LandingPage } from './shared/components/pages/LandingPage';
import DevPanel from './dev/client/DevPanel';
import { PatternConfigProvider } from './shared/context/PatternConfigContext';
import { getPatterns, getTabs } from './utils/data/tabs';

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
    path: '/2/task-gray',
    component: props => (
      <PatternConfigProvider {...props}>
        <CoeApp {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-gray/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(grayTaskConfig),
  },
  {
    path: '/2/task-orange',
    component: props => (
      <PatternConfigProvider {...props}>
        <Form1990Entry {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-orange/introduction?loggedIn=false'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfigForOrangeTask),
  },
  {
    path: '/2/task-blue',
    component: props => (
      <PatternConfigProvider {...props}>
        <App {...props} />
      </PatternConfigProvider>
    ),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-blue/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(blueFormConfig),
  },
  {
    path: '/2/post-study',
    component: props => (
      <PatternConfigProvider {...props}>
        <ReviewPage {...props} />,
      </PatternConfigProvider>
    ),
  },
];

const routes = [
  ...pattern1Routes,
  ...pattern2Routes,
  {
    path: '/dev',
    component: props => (
      <div className="vads-l-grid-container--full">
        <DevPanel {...props} />
      </div>
    ),
  },
  {
    path: '*',
    component: props => (
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="usa-width-two-thirds medium-8 columns">
            <LandingPage
              {...props}
              getTabs={getTabs}
              getPatterns={getPatterns}
            />
          </div>
        </div>
      </div>
    ),
  },
];

export default routes;
