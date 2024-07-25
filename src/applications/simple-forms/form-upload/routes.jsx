import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import App from './containers/App.jsx';

const config = formConfig();

const routes = [
  {
    path: '/21-0779',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(config),
  },
  // or dynamic
  // {
  //   path: '/:formId',
  //   component: App,
  //   indexRoute: {},
  //   childRoutes: createRoutesWithSaveInProgress(config),
  // },
];

export default routes;
