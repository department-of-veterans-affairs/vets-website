import React, { lazy } from 'react';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { Toggler } from 'platform/utilities/feature-toggles';

import greenFormConfig from './patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from './patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from './patterns/pattern1/TaskPurple/config/form';
import ezrFormConfig from './patterns/pattern1/ezr/config/form';

import personalInfoDemoConfig from './patterns/pattern2/personal-information/config/form';
import grayTaskConfig from './patterns/pattern2/TaskGray/form/config/form';

import blueFormConfig from './patterns/pattern2/TaskBlue/config/form';
import { formConfigForOrangeTask } from './patterns/pattern2/TaskOrange/config/form';

import maritalStatusConfig from './patterns/pattern6/config/form';

import ReviewPage from './patterns/pattern2/post-study/ReviewPage';

import { LandingPage } from './shared/components/pages/LandingPage';

import { PatternConfigProvider } from './shared/context/PatternConfigContext';

const App = lazy(() => import('./App'));
const CoeApp = lazy(() =>
  import('./patterns/pattern2/TaskGray/form/containers/App'),
);
const Form1990Entry = lazy(() =>
  import('./patterns/pattern2/TaskOrange/Form1990App'),
);

import { plugin } from './shared/components/VADXPlugin';

import { VADX } from './vadx';
import { Debug } from './vadx/app/pages/debug/Debug';
import { withLayout } from './vadx/app/layout/withLayout';
import { Servers } from './vadx/app/pages/servers/Servers';
import { FeatureToggles } from './vadx/app/pages/feature-toggles/FeatureToggles';

// Higher order component to wrap routes in the PatternConfigProvider and other common components
export const routeHoc = Component => props => (
  <PatternConfigProvider {...props}>
    <VADX plugin={plugin} featureToggleName={Toggler.TOGGLE_NAMES.aedpVADX}>
      <Component {...props} />
    </VADX>
  </PatternConfigProvider>
);

const pattern1Routes = [
  {
    path: '/1/task-green',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-green/introduction?loggedIn=false'),
    },
    childRoutes: createRoutesWithSaveInProgress(greenFormConfig),
  },
  {
    path: '/1/task-yellow',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-yellow/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(yellowFormConfig),
  },
  {
    path: '/1/task-purple',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/1/task-purple/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(purpleFormConfig),
  },
  {
    path: '/1/ezr',
    component: routeHoc(App),
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
    component: routeHoc(CoeApp),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-gray/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(grayTaskConfig),
  },
  {
    path: '/2/task-orange',
    component: routeHoc(Form1990Entry),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-orange/introduction?loggedIn=false'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfigForOrangeTask),
  },
  {
    path: '/2/task-blue',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/task-blue/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(blueFormConfig),
  },
  {
    path: '/2/post-study',
    component: routeHoc(ReviewPage),
  },
  {
    path: '/2/personal-information-demo',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/2/personal-information-demo/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(personalInfoDemoConfig),
  },
];

const pattern6Routes = [
  {
    path: '/6/marital-information',
    component: routeHoc(App),
    indexRoute: {
      onEnter: (nextState, replace) =>
        replace('/6/marital-information/introduction?loggedIn=true'),
    },
    childRoutes: createRoutesWithSaveInProgress(maritalStatusConfig),
  },
];

const routes = [
  ...pattern1Routes,
  ...pattern2Routes,
  ...pattern6Routes,
  {
    path: '/vadx',
    component: routeHoc(withLayout(Servers)),
  },
  {
    path: '/vadx/debug',
    component: routeHoc(withLayout(Debug)),
  },
  {
    path: '/vadx/feature-toggles',
    component: routeHoc(withLayout(FeatureToggles)),
  },
  {
    path: '*',
    component: routeHoc(LandingPage),
  },
];

export default routes;
