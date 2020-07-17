import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import Form0994App from './Form0994App';
import formConfig from './config/form';

const routes = [
  {
    path: '/',
    component: Form0994App,
    indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
    childRoutes: createRoutesWithSaveInProgress(formConfig),
  },
];

export default routes;
