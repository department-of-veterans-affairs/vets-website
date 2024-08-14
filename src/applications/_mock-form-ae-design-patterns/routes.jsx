import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import greenFormConfig from './config/prefill/taskGreen/form';
import yellowFormConfig from './config/prefill/taskYellow/form';
import App from './containers/App';
import { NotFoundPage } from './containers/NotFoundPage';

const routes = [
  {
    path: '/task-green',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/task-green/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(greenFormConfig),
  },
  {
    path: '/task-yellow',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/task-yellow/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(yellowFormConfig),
  },
  {
    path: '/task-purple',
    component: App,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/task-purple/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(yellowFormConfig),
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;
