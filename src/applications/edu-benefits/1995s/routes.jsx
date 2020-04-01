import { createRoutesWithSaveInProgress } from '../../../platform/forms/save-in-progress/helpers';

import Form1995sApp from './Form1995sApp';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form1995sApp,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
