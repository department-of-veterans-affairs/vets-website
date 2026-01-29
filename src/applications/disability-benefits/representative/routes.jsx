import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import RepForm526EZApp from './RepForm526EZApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: RepForm526EZApp,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/introduction'),
    },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
