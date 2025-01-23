import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import App from './containers/App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: {
      onEnter: (_nextState, replace) => replace('/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
