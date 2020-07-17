import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import BDDApp from './BDDApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: BDDApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
