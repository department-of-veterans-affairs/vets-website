import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import Form10203App from './Form10203App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form10203App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
