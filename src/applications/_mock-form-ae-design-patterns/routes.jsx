import React, { lazy, Suspense } from 'react';
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
import pattern7Config from './patterns/pattern7/config/form';
import Pattern7Introduction from './patterns/pattern7/components/IntroductionPage';
import Pattern7Review from './patterns/pattern7/components/ReviewPage';
import Pattern7Confirmation from './patterns/pattern7/components/ConfirmationPage';

import ReviewPage from './patterns/pattern2/post-study/ReviewPage';

import { LandingPage } from './shared/components/pages/LandingPage';

import {
  PatternConfigProvider,
  PatternConfigContext,
} from './shared/context/PatternConfigContext';

const App = lazy(() => import('./App'));
const CoeApp = lazy(() =>
  import('./patterns/pattern2/TaskGray/form/containers/App'),
);
const Form1990Entry = lazy(() =>
  import('./patterns/pattern2/TaskOrange/Form1990App'),
);

import { plugin } from './shared/components/VADXPlugin';

const LoadingIndicator = () => (
  <va-loading-indicator
    label="Loading"
    message="Loading your application..."
    set-focus
  />
);

import { VADX } from './vadx';
import { Debug } from './vadx/app/pages/debug/Debug';
import { withLayout } from './vadx/app/layout/withLayout';
import { Servers } from './vadx/app/pages/servers/Servers';
import { FeatureToggles } from './vadx/app/pages/feature-toggles/FeatureToggles';

// Higher order component to wrap routes in the PatternConfigProvider and other common components
const routeHoc = Component => props => (
  <PatternConfigProvider {...props}>
    <VADX plugin={plugin} featureToggleName={Toggler.TOGGLE_NAMES.aedpVADX}>
      <Component {...props} />
    </VADX>
  </PatternConfigProvider>
);

// route HOC variant that does NOT include the VADX wrapper (useful for demo-only routes)
const routeHocNoVadx = Component => props => (
  <PatternConfigProvider {...props}>
    <Suspense fallback={<LoadingIndicator />}>
      <Component {...props} />
    </Suspense>
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

// Helper to render pattern7 pages with proper layout and navigation
/* eslint-disable react/prop-types */
const renderPattern7Page = PageComponent => props => {
  const goTo = path => () => {
    if (props.history && props.history.push) {
      props.history.push(`/7/copy-of-submission/${path}`);
    } else {
      window.location.href = `/mock-form-ae-design-patterns/7/copy-of-submission/${path}`;
    }
  };

  // Customize navigation based on the page
  let onNext;
  let onBack;
  if (PageComponent === Pattern7Introduction) {
    onNext = goTo('review');
    onBack = undefined;
  } else if (PageComponent === Pattern7Review) {
    onNext = goTo('confirmation');
    onBack = goTo('introduction');
  } else {
    // Confirmation page
    onNext = undefined;
    onBack = goTo('review');
  }

  // Create a custom router context that includes the pattern7 formConfig
  const routerWithFormConfig = {
    ...props.router,
    routes: [...(props.router?.routes || []), { formConfig: pattern7Config }],
  };

  return (
    <PatternConfigContext.Provider value={pattern7Config}>
      <Suspense fallback={<LoadingIndicator />}>
        <App {...props} router={routerWithFormConfig}>
          <PageComponent {...props} onNext={onNext} onBack={onBack} />
        </App>
      </Suspense>
    </PatternConfigContext.Provider>
  );
};
/* eslint-enable react/prop-types */

const pattern7Routes = [
  {
    path: '/7/copy-of-submission',
    // Use the no-VADX HOC so this demo doesn't render the VADX button/panel
    component: routeHocNoVadx(App),
    childRoutes: createRoutesWithSaveInProgress(pattern7Config),
  },
];

const routes = [
  ...pattern1Routes,
  ...pattern2Routes,
  ...pattern6Routes,
  // Explicit direct routes for pattern7 pages - these must come before the parent route
  {
    path: '/7/copy-of-submission/introduction',
    component: renderPattern7Page(Pattern7Introduction),
  },
  {
    path: '/7/copy-of-submission/review',
    component: renderPattern7Page(Pattern7Review),
  },
  {
    path: '/7/copy-of-submission/confirmation',
    component: renderPattern7Page(Pattern7Confirmation),
  },
  ...pattern7Routes,
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
